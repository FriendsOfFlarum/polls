<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use Carbon\Carbon;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class EditPollHandler
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

    public function handle(EditPoll $command)
    {
        /**
         * @var Poll
         */
        $actor = $command->actor;
        $poll = Poll::findOrFail($command->pollId);
        $data = $command->data;

        if ($poll->hasEnded()) {
            throw new PermissionDeniedException();
        }

        if (!$actor->can('edit.polls')
            && !($actor->id === $poll->user->id && $actor->can('selfEditPolls'))) {
            throw new PermissionDeniedException();
        }

        $attributes = Arr::get($data, 'attributes', []);
        $options = collect(Arr::get($attributes, 'options', []));

        if (isset($attributes['question'])) {
            $poll->question = $attributes['question'];
        }

        if (isset($attributes['publicPoll'])) {
            $poll->public_poll = (bool) $attributes['publicPoll'];
        }

        if (isset($attributes['endDate'])) {
            $date = Carbon::createFromTimeString($attributes['endDate']);

            if (!$poll->hasEnded() && $date->isFuture() && ($poll->end_date === null || $poll->end_date->lessThanOrEqualTo($date))) {
                $poll->end_date = $date;
            }
        }

        $poll->save();

        // remove options not passed if 2 or more are
        if ($options->isNotEmpty() && $options->count() >= 2) {
            $ids = $options->pluck('id');

            $poll->options()->each(function ($option) use ($ids) {
                /**
                 * @var PollOption
                 */
                if (!$ids->contains($option->id)) {
                    $option->delete();
                }
            });
        }

        // update + add new options
        foreach ($options as $key => $opt) {
            $id = Arr::get($opt, 'id');
            $answer = Arr::get($opt, 'attributes.answer');

            $poll->options()->updateOrCreate([
                'id' => $id,
            ], [
                'answer' => $answer,
            ]);
        }

        return $poll;
    }
}
