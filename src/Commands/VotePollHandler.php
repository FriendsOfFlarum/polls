<?php

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
     * @param Dispatcher        $events
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }


    public function handle(VotePoll $command) {
        /**
         * @var $poll Poll
         */
        $actor = $command->actor;
        $poll = Poll::findOrFail($command->pollId);
        $data = $command->data;

        $optionId = Arr::get($data, 'optionId');

        if ($poll->hasEnded()) {
            throw new PermissionDeniedException();
        }

        /**
         * @var $vote PollVote|null
         */
        $vote = $poll->votes()->where('user_id', $actor->id)->first();

        if ($optionId === null && $vote !== null) {
            $vote->delete();
        } else if ($optionId !== null) {
            $poll->votes()->updateOrCreate([
                'user_id' => $actor->id,
            ], [
                'option_id' => $optionId,
            ]);

            app()->make('events')->fire(new PollWasVoted($actor, $poll, $vote,$vote !== null));
        }

        return $poll;
    }
}