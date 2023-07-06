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

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Events\PollWasVoted;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use FoF\Polls\PollVote;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

/**
 * Legacy handler for single-vote polls functionality. Kept for backwards compatibility.
 */
class VotePollHandler
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Container
     */
    protected $container;

    /**
     * @param Dispatcher                  $events
     * @param SettingsRepositoryInterface $settings
     * @param Container                   $container
     */
    public function __construct(Dispatcher $events, SettingsRepositoryInterface $settings, Container $container)
    {
        $this->events = $events;
        $this->settings = $settings;
        $this->container = $container;
    }

    public function handle(VotePoll $command)
    {
        $actor = $command->actor;
        /**
         * @var $poll Poll
         */
        $poll = Poll::findOrFail($command->pollId);
        $data = $command->data;

        $optionId = Arr::get($data, 'optionId');

        $actor->assertCan('vote', $poll);

        /**
         * @var $vote PollVote|null
         */
        $vote = $poll->votes()->where('user_id', $actor->id)->first();

        if ($vote) {
            $actor->assertCan('changeVote', $poll);

            if ($poll->allow_multiple_votes) {
                throw new PermissionDeniedException(); // TODO change to proper error
            }
        }

        $previousOption = null;

        if ($optionId === null && $vote !== null) {
            $previousOption = $vote->option;

            $vote->delete();
            $vote = null;
        } elseif ($optionId !== null) {
            if ($vote) {
                $previousOption = $vote->option;

                $vote->option_id = $optionId;
                $vote->save();
            } else {
                $vote = $poll->votes()->create([
                    'user_id'   => $actor->id,
                    'option_id' => $optionId,
                ]);
            }

            // Forget the relation in case it was loaded for $previousOption
            $vote->unsetRelation('option');

            $vote->option->refreshVoteCount()->save();

            $this->events->dispatch(new PollWasVoted($actor, $poll, $vote, $vote !== null));
        }

        $poll->refreshVoteCount()->save();

        if ($previousOption) {
            $previousOption->refreshVoteCount()->save();

            $this->pushUpdatedOption($previousOption);
        }

        if ($vote) {
            $this->pushUpdatedOption($vote->option);
        }

        return $poll;
    }

    /**
     * Pushes an updated option through websocket.
     *
     * @param PollOption $option
     *
     * @throws \Pusher\PusherException
     */
    public function pushUpdatedOption(PollOption $option)
    {
        if ($pusher = $this->getPusher()) {
            $pusher->trigger('public', 'updatedPollOptions', [
                'pollId'          => $option->poll->id,
                'pollVoteCount'   => $option->poll->vote_count,
                'options'         => [
                    [
                        'id'          => $option->id,
                        'voteCount'   => $option->vote_count,
                    ],
                ],
            ]);
        }
    }

    private function getPusher()
    {
        return MultipleVotesPollHandler::pusher($this->container, $this->settings);
    }
}
