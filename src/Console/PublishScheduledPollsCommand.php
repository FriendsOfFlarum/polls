<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Console;

use Carbon\Carbon;
use Flarum\Foundation\ValidationException;
use FoF\Polls\Events\PollWasPublished;
use FoF\Polls\Poll;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Console\Command;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Validation\ValidationException as LaravelValidationException;

class PublishScheduledPollsCommand extends Command
{
    protected $signature = 'fof:polls:publish-scheduled';
    protected $description = 'Publish any global poll drafts whose scheduled_publish_at has arrived.';

    public function handle(
        PollValidator $validator,
        Dispatcher $events,
        ConnectionInterface $db
    ): int {
        // Wrap the select + update in a single transaction with row-level
        // locks so concurrent runs (multiple ECS tasks, manual CLI while cron
        // fires, etc.) don't double-publish. Task A's SELECT ... FOR UPDATE
        // blocks task B until A commits; by the time B resumes, the rows
        // either have `published_at` set or `scheduled_publish_error` set, so
        // they no longer match the WHERE clause and B's result set is empty.
        //
        // We inject ConnectionInterface rather than using the DB facade because
        // Flarum's console bootstrap doesn't set facade roots.
        $db->transaction(function () use ($validator, $events) {
            $due = Poll::query()
                ->whereNull('post_id')
                ->whereNull('published_at')
                ->whereNotNull('scheduled_publish_at')
                ->whereNull('scheduled_publish_error')
                ->where('scheduled_publish_at', '<=', Carbon::now())
                ->lockForUpdate()
                ->get();

            foreach ($due as $poll) {
                try {
                    $validator->assertValid([
                        'question' => $poll->question,
                        'endDate'  => $poll->end_date?->toDateTimeString(),
                    ]);

                    if ($poll->options()->count() < 2) {
                        throw new ValidationException(['options' => 'Poll must have at least 2 options to publish.']);
                    }

                    $poll->published_at = Carbon::now();
                    $poll->scheduled_publish_at = null;
                    $poll->scheduled_publish_error = null;
                    $poll->save();

                    $events->dispatch(new PollWasPublished($poll, null));

                    $this->info("Published poll {$poll->id}");
                } catch (ValidationException $e) {
                    // Flarum's ValidationException carries attribute messages
                    // we authored ourselves (e.g. "options" below). Surface them
                    // verbatim — these are the signal the admin needs to fix
                    // the poll.
                    $poll->scheduled_publish_error = trim($e->getMessage());
                    $poll->save();
                    $this->warn("Failed to publish poll {$poll->id}: {$e->getMessage()}");
                } catch (LaravelValidationException $e) {
                    // AbstractValidator::assertValid throws Laravel's
                    // ValidationException. `getMessage()` here is a generic
                    // "The given data was invalid." — pull the first concrete
                    // message out of the bag instead.
                    $first = collect($e->errors())->flatten()->first();
                    $poll->scheduled_publish_error = is_string($first) && $first !== '' ? $first : 'Validation failed.';
                    $poll->save();
                    $this->warn("Failed to publish poll {$poll->id}: {$e->getMessage()}");
                } catch (\Throwable $e) {
                    // Unexpected failure (DB, filesystem, etc.). The raw message
                    // may contain stack-trace fragments or internal paths, so
                    // store a generic marker for the UI and keep the real
                    // message in the CLI output for the operator.
                    $poll->scheduled_publish_error = 'An unexpected error occurred while publishing this poll.';
                    $poll->save();
                    $this->warn("Failed to publish poll {$poll->id}: {$e->getMessage()}");
                }
            }
        });

        return 0;
    }
}
