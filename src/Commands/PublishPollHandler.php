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

use Carbon\Carbon;
use Flarum\Foundation\ValidationException;
use FoF\Polls\Events\PollWasPublished;
use FoF\Polls\Poll;
use FoF\Polls\PollRepository;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class PublishPollHandler
{
    public function __construct(
        protected PollRepository $polls,
        protected PollValidator $validator,
        protected Dispatcher $events
    ) {
    }

    public function handle(PublishPoll $command): Poll
    {
        $poll = $this->polls->findOrFail($command->pollId, $command->actor);

        $command->actor->assertCan('publish', $poll);

        $attributes = Arr::get($command->data, 'attributes', []);
        $hasScheduledKey = array_key_exists('scheduledFor', $attributes);
        $scheduledFor = Arr::get($attributes, 'scheduledFor');

        // Cancel existing schedule: explicit scheduledFor: null
        if ($hasScheduledKey && $scheduledFor === null) {
            $poll->scheduled_publish_at = null;
            $poll->scheduled_publish_error = null;
            $poll->save();

            return $poll;
        }

        // Re-validate against current poll state (the unified rule set
        // applies — same rules drafts already passed at save time).
        $this->validator->assertValid([
            'question' => $poll->question,
            'endDate'  => $poll->end_date?->toDateTimeString(),
        ]);

        if ($poll->options()->count() < 2) {
            throw new ValidationException(['options' => 'Poll must have at least 2 options to publish.']);
        }

        // Schedule path. Input parsing + timezone rules live in the
        // validator; the handler only enforces business rules (future,
        // before end date) and persists.
        if ($scheduledFor !== null) {
            $scheduled = $this->validator->parseScheduledFor($scheduledFor);

            if (!$scheduled->isFuture()) {
                throw new ValidationException(['scheduledFor' => 'Scheduled time must be in the future.']);
            }

            if ($poll->end_date !== null && $scheduled->gte($poll->end_date)) {
                throw new ValidationException(['scheduledFor' => 'Scheduled time must be before the poll end date.']);
            }

            $poll->scheduled_publish_at = $scheduled;
            $poll->scheduled_publish_error = null;
            $poll->save();

            return $poll;
        }

        // Immediate publish path
        $poll->published_at = Carbon::now();
        $poll->scheduled_publish_at = null;
        $poll->scheduled_publish_error = null;
        $poll->save();

        $this->events->dispatch(new PollWasPublished($poll, $command->actor));

        return $poll;
    }
}
