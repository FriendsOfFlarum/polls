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

use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\User;
use FoF\Polls\Poll;
use Illuminate\Contracts\Events\Dispatcher;

class DeletePollHandler
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

    public function handle(DeletePoll $command)
    {
        /**
         * @var User
         */
        $actor = $command->actor;
        $poll = Poll::findOrFail($command->pollId);

        if (!$actor->can('edit.polls')
            && !($actor->id === $poll->user->id && $actor->can('selfEditPolls'))) {
            throw new PermissionDeniedException();
        }

        $poll->delete();
    }
}
