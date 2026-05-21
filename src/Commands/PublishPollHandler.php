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
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Arr;

class PublishPollHandler
{
    public function __construct(
        protected PollRepository $polls,
        protected PollValidator $validator,
        protected Dispatcher $events,
        protected ConnectionInterface $db
    ) {
    }

    public function handle(PublishPoll $command): Poll
    {
        // Wrap the whole handler in a transaction with a row lock so two
        // concurrent publish requests for the same poll can't both pass
        // the policy and dispatch `PollWasPublished` twice. Same guarantee
        // the scheduled-publication console command relies on.
        return $this->db->transaction(function () use ($command) {
            $poll = $this->polls->queryVisibleTo($command->actor)
                ->lockForUpdate()
                ->findOrFail($command->pollId);

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

            // Re-validate against current poll state. endDate is deliberately
            // omitted from the validator input: the `after:now` rule is a
            // CREATE-time guard (preventing past dates at save), but a draft
            // saved months ago with a then-future endDate can legitimately
            // have a now-past endDate without being invalid data — it just
            // can't be published as-is. We surface that separately below
            // with an actionable message instead of the validator's generic
            // "must be after now" error.
            $this->validator->assertValid([
                'question' => $poll->question,
            ]);

            if ($poll->end_date !== null && $poll->end_date->isPast()) {
                throw new ValidationException(['endDate' => 'Poll end date has already passed; update or clear it before publishing.']);
            }

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
        });
    }
}
