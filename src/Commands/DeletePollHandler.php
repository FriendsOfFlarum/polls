<?php

namespace FoF\Polls\Commands;

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Poll;
use FoF\Polls\PollVote;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class DeletePollHandler
{
    use AssertPermissionTrait;

    /**
     * @var Dispatcher
     */
    private $events;

    /**
     * @param Dispatcher        $events
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }


    public function handle(DeletePoll $command) {
        /**
         * @var $poll Poll
         */
        $actor = $command->actor;
        $poll = Poll::findOrFail($command->pollId);

        if (!$actor->can('edit.polls')
            && !($actor->id === $poll->user->id && $actor->can('selfEditPolls'))) {
            throw new PermissionDeniedException;
        }

        $poll->delete();
    }
}