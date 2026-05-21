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

use Illuminate\Console\Scheduling\Event;

class PublishScheduledPollsSchedule
{
    public function __invoke(Event $event): void
    {
        $event
            ->everyMinute()
            // Best-effort guard against same-host re-entrancy (long batch
            // overlapping the next minute's run). Relies on the Laravel
            // cache; no-ops on single-server file cache, which is fine —
            // the command's own DB-level lockForUpdate is the real guard.
            ->withoutOverlapping()
            // Best-effort guard against multi-node dispatch (e.g. 2-4 ECS
            // tasks each firing cron). Only effective when the cache driver
            // is shared across nodes (Redis/Valkey, DynamoDB, database).
            ->onOneServer();
    }
}
