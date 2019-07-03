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

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Events\PollWasVoted;
use FoF\Polls\Poll;
use FoF\Polls\PollVote;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class VotePollHandler
{
    use AssertPermissionTrait;

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
         * @var Poll
         */
        $actor = $command->actor;
        $poll = Poll::findOrFail($command->pollId);
        $data = $command->data;

        $optionId = Arr::get($data, 'optionId');

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

            app()->make('events')->fire(new PollWasVoted($actor, $poll, $vote, $vote !== null));
        }

        return $poll;
    }
}
