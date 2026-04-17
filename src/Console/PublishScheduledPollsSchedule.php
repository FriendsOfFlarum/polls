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
use Illuminate\Console\Scheduling\Schedule;

class PublishScheduledPollsSchedule
{
    public function __invoke(Schedule $schedule): Event
    {
        return $schedule->command('fof:polls:publish-scheduled')->everyMinute();
    }
}
