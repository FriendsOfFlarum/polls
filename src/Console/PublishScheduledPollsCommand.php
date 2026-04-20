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
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Polls\Events\PollWasPublished;
use FoF\Polls\Poll;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Console\Command;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\DB;

class PublishScheduledPollsCommand extends Command
{
    protected $signature = 'fof:polls:publish-scheduled';
    protected $description = 'Publish any global poll drafts whose scheduled_publish_at has arrived.';

    public function handle(
        SettingsRepositoryInterface $settings,
        PollValidator $validator,
        Dispatcher $events
    ): int {
        if (!(bool) $settings->get('fof-polls.enable_scheduled_publication', true)) {
            return 0;
        }

        // Wrap the select + update in a single transaction with row-level
        // locks so concurrent runs (multiple ECS tasks, manual CLI while cron
        // fires, etc.) don't double-publish. Task A's SELECT ... FOR UPDATE
        // blocks task B until A commits; by the time B resumes, the rows
        // either have `published_at` set or `scheduled_publish_error` set, so
        // they no longer match the WHERE clause and B's result set is empty.
        DB::transaction(function () use ($validator, $events) {
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
                    $validator->setDraft(false);
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
                } catch (\Throwable $e) {
                    $poll->scheduled_publish_error = $e->getMessage();
                    $poll->save();
                    $this->warn("Failed to publish poll {$poll->id}: {$e->getMessage()}");
                }
            }
        });

        return 0;
    }
}
