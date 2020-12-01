<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\User;
use FoF\Polls\Events\PollWasVoted;
use FoF\Polls\Poll;
use FoF\Polls\PollVote;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Pusher\Pusher;

class VotePollHandler
{
    /**
     * @var Dispatcher
     */
    private $events;

    /**
     * @param Dispatcher $events
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function handle(VotePoll $command)
    {
        /**
         * @var User
         */
        $actor = $command->actor;
        $poll = Poll::findOrFail($command->pollId);
        $data = $command->data;

        $optionId = Arr::get($data, 'optionId');

        $actor->assertCan('votePolls');

        if ($poll->hasEnded()) {
            throw new PermissionDeniedException();
        }

        /**
         * @var PollVote|null
         */
        $vote = $poll->votes()->where('user_id', $actor->id)->first();

        if ($optionId === null && $vote !== null) {
            $vote->delete();
        } elseif ($optionId !== null) {
            $vote = $poll->votes()->updateOrCreate([
                'user_id' => $actor->id,
            ], [
                'option_id' => $optionId,
            ]);

            app('events')->dispatch(new PollWasVoted($actor, $poll, $vote, $vote !== null));

            $this->pushNewVote($vote);
        }

        return $poll;
    }

    /**
     * @param $vote
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
     * @throws \Pusher\PusherException
     *
     * @return bool|\Illuminate\Foundation\Application|mixed|Pusher
     */
    private function getPusher()
    {
        if (!class_exists(Pusher::class)) {
            return false;
        }

        if (app()->bound(Pusher::class)) {
            return app(Pusher::class);
        } else {
            $settings = app('flarum.settings');

            $options = [];

            if ($cluster = $settings->get('flarum-pusher.app_cluster')) {
                $options['cluster'] = $cluster;
            }

            return new Pusher(
                $settings->get('flarum-pusher.app_key'),
                $settings->get('flarum-pusher.app_secret'),
                $settings->get('flarum-pusher.app_id'),
                $options
            );
        }
    }
}
