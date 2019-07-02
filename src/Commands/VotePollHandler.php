<?php

namespace FoF\Polls\Commands;

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
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

//        if ($vote === null) {
//            $poll->votes()->create([
//                'user_id' => $actor->id,
//                'option_id' => $optionId
//            ]);
//        } else {
//            $vote->option_id = $optionId;
//            $vote->save();
//        }

        if ($optionId === null && $vote !== null) {
            $vote->delete();
        } else if ($optionId !== null) {
            $poll->votes()->updateOrCreate([
                'user_id' => $actor->id,
            ], [
                'option_id' => $optionId,
            ]);
        }

        return $poll;
    }
}