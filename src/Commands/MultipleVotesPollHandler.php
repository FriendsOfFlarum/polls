<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use Flarum\Foundation\ErrorHandling\Reporter;
use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Events\PollVotesChanged;
use FoF\Polls\Events\PollWasVoted;
use FoF\Polls\Poll;
use FoF\Polls\PollVote;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionResolverInterface;
use Illuminate\Support\Arr;
use Illuminate\Validation\Factory;
use Pusher;

class MultipleVotesPollHandler
{
    /**
     * @var Dispatcher
     */
    private $events;

    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    /**
     * @var Container
     */
    private $container;

    /**
     * @var Factory
     */
    private $validation;

    /**
     * @var ConnectionResolverInterface
     */
    private $db;

    /**
     * @param Dispatcher                  $events
     * @param SettingsRepositoryInterface $settings
     * @param Container                   $container
     */
    public function __construct(Dispatcher $events, SettingsRepositoryInterface $settings, Container $container, Factory $validation, ConnectionResolverInterface $db)
    {
        $this->events = $events;
        $this->settings = $settings;
        $this->container = $container;
        $this->validation = $validation;
        $this->db = $db;
    }

    /**
     * @throws PermissionDeniedException
     * @throws ValidationException
     */
    public function handle(MultipleVotesPoll $command)
    {
        $actor = $command->actor;
        /**
         * @var $poll Poll
         */
        $poll = Poll::findOrFail($command->pollId);
        $data = $command->data;

        $actor->assertCan('vote', $poll);

        $optionIds = Arr::get($data, 'optionIds');
        $options = $poll->options()->get();
        $votes = $poll->myVotes($actor)->get();

        $maxVotes = $poll->allow_multiple_votes ? $poll->max_votes : 1;

        if ($maxVotes == 0) {
            $maxVotes = $options->count();
        }

        $validator = $this->validation->make([
            'options' => $optionIds,
        ], [
            'options' => [
                'present',
                'array',
                'max:'.$maxVotes,
                function ($attribute, $value, $fail) use ($options) {
                    foreach ($value as $optionId) {
                        if (!$options->contains('id', $optionId)) {
                            $fail('Invalid option ID.');
                        }
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            throw new ValidationException(['options' => $validator->getMessageBag()->first('options')]);
        }

        $deletedVotes = $votes->filter(function ($vote) use ($optionIds) {
            return !in_array((string) $vote->option_id, $optionIds);
        });
        $newOptionIds = collect($optionIds)->filter(function ($optionId) use ($votes) {
            return !$votes->contains('option_id', $optionId);
        });

        $this->db->transaction(function () use ($newOptionIds, $deletedVotes, $poll, $actor) {
            // Unvote options
            $poll->myVotes($actor)->whereIn('id', $deletedVotes->pluck('id'))->delete();
            $deletedVotes->each->unsetRelation('option');
            $deletedVotes->pluck('option')->each->refreshVoteCount()->each->save();

            // Vote options
            $newOptionIds->each(function ($optionId) use ($poll, $actor) {
                $vote = $poll->votes()->create([
                    'user_id'   => $actor->id,
                    'option_id' => $optionId,
                ]);

                $vote->option->refreshVoteCount()->save();

                $this->pushNewVote($vote);
            });

            $poll->refreshVoteCount()->save();
        });

        $myVotesWithOptions = $poll->myVotes($actor)->with('option')->get();
        $currentVoteOptions = $myVotesWithOptions->pluck('option');
        $deletedVoteOptions = $deletedVotes->pluck('option');

        // Legacy event for backward compatibility with single-vote polls. Can be removed in breaking release.
        if (!$poll->allow_multiple_votes && !$myVotesWithOptions->isEmpty()) {
            $this->events->dispatch(new PollWasVoted($actor, $poll, $myVotesWithOptions->first(), !$deletedVotes->isEmpty() && !$newOptionIds->isEmpty()));
        }

        $this->events->dispatch(new PollVotesChanged($actor, $poll, $deletedVoteOptions->pluck('option.id'), $newOptionIds));

        try {
            $this->pushUpdatedOptions($poll, $currentVoteOptions->concat($deletedVoteOptions));
        } catch (\Exception $e) {
            // We don't want to display an error to the user if the websocket functionality fails.
            $reporters = resolve('container')->tagged(Reporter::class);

            foreach ($reporters as $reporter) {
                $reporter->report($e);
            }
        }

        return $poll;
    }

    /**
     * Pushes a new vote through websocket. Kept for backward compatibility, but we are no longer using it.
     *
     * @param PollVote $vote
     *
     * @throws \Pusher\PusherException
     */
    public function pushNewVote($vote)
    {
        if ($pusher = $this->getPusher()) {
            $pusher->trigger('public', 'newPollVote', $vote);
        }
    }

    /**
     * Pushes an updated option through websocket.
     *
     * @param \Illuminate\Support\Collection $options
     *
     * @throws \Pusher\PusherException
     */
    public function pushUpdatedOptions(Poll $poll, $options)
    {
        if ($pusher = $this->getPusher()) {
            $pusher->trigger('public', 'updatedPollOptions', [
                'pollId'          => $poll->id,
                'pollVoteCount'   => $poll->vote_count,
                'options'         => $options->pluck('vote_count', 'id')->toArray(),
            ]);
        }
    }

    private function getPusher()
    {
        return self::pusher($this->container, $this->settings);
    }

    /**
     * @throws \Pusher\PusherException
     *
     * @return bool|\Illuminate\Foundation\Application|mixed|Pusher
     */
    public static function pusher(Container $container, SettingsRepositoryInterface $settings)
    {
        if (!class_exists(Pusher::class)) {
            return false;
        }

        if ($container->bound(Pusher::class)) {
            return $container->make(Pusher::class);
        } else {
            $options = [];

            if ($cluster = $settings->get('flarum-pusher.app_cluster')) {
                $options['cluster'] = $cluster;
            }

            $appKey = $settings->get('flarum-pusher.app_key');
            $appSecret = $settings->get('flarum-pusher.app_secret');
            $appId = $settings->get('flarum-pusher.app_id');

            // Don't create a Pusher instance if we don't have the required credentials.
            // This is to prevent errors when e.g. the Pusher extension is disabled, since Pusher seems
            // to throw a deprecated warning when trying to create a hash from a null secret.
            if (!$appKey || !$appSecret || !$appId) {
                return false;
            }

            return new Pusher(
                $appKey,
                $appSecret,
                $appId,
                $options
            );
        }
    }
}
