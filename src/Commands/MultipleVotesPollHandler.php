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
use FoF\Polls\PollRepository;
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
     * @var PollRepository
     */
    private $polls;

    /**
     * @param Dispatcher                  $events
     * @param SettingsRepositoryInterface $settings
     * @param Container                   $container
     */
    public function __construct(PollRepository $polls, Dispatcher $events, SettingsRepositoryInterface $settings, Container $container, Factory $validation, ConnectionResolverInterface $db)
    {
        $this->polls = $polls;
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
        $data = $command->data;

        $poll = $this->polls->findOrFail($command->pollId, $actor);

        $actor->assertCan('vote', $poll);

        $optionIds = Arr::get($data, 'optionIds');
        $options = $poll->options;
        $myVotes = $poll->myVotes($actor)->get();

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

        $deletedVotes = $myVotes->filter(function ($vote) use ($optionIds) {
            return !in_array((string) $vote->option_id, $optionIds);
        });
        $newOptionIds = collect($optionIds)->filter(function ($optionId) use ($myVotes) {
            return !$myVotes->contains('option_id', $optionId);
        });

        $this->db->transaction(function () use ($myVotes, $options, $newOptionIds, $deletedVotes, $poll, $actor) {
            // Unvote options
            if ($deletedVotes->isNotEmpty()) {
                $poll->myVotes($actor)->whereIn('id', $deletedVotes->pluck('id'))->delete();
                $deletedVotes->each->unsetRelation('option');

                $myVotes->forget($deletedVotes->pluck('id')->toArray());
            }

            // Vote options
            $newOptionIds->each(function ($optionId) use ($myVotes, $poll, $actor) {
                $vote = $poll->votes()->create([
                    'user_id'   => $actor->id,
                    'option_id' => $optionId,
                ]);

                $myVotes->push($vote);
            });

            // Update vote counts of options & poll
            $changedOptions = $options->whereIn('id', $deletedVotes->pluck('option_id')->toArray())
                ->concat($options->whereIn('id', $newOptionIds->toArray()));

            $changedOptions->each->refreshVoteCount()->each->save();

            if ($deletedVotes->isNotEmpty() || $newOptionIds->isNotEmpty()) {
                $poll->refreshVoteCount()->save();
            }
        });

        $currentVoteOptions = $options->whereIn('id', $myVotes->pluck('option_id'))->except($deletedVotes->pluck('option_id')->toArray());
        $deletedVoteOptions = $options->whereIn('id', $deletedVotes->pluck('option_id'));

        // Legacy event for backward compatibility with single-vote polls. Can be removed in breaking release.
        if (!$poll->allow_multiple_votes && !$myVotes->isEmpty()) {
            $this->events->dispatch(new PollWasVoted($actor, $poll, $myVotes->first(), !$deletedVotes->isEmpty() && !$newOptionIds->isEmpty()));
        }

        $this->events->dispatch(new PollVotesChanged($actor, $poll, $deletedVoteOptions->pluck('option.id'), $newOptionIds));

        try {
            $changedOptionsIds = $currentVoteOptions->concat($deletedVoteOptions)->pluck('id');
            $changedOptions = $options->whereIn('id', $changedOptionsIds);

            $this->pushUpdatedOptions($poll, $changedOptions);
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
