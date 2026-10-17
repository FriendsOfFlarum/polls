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

use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use Illuminate\Console\Command;

class RefreshVoteCountCommand extends Command
{
    protected $signature = 'fof:polls:refresh';

    protected $description = 'Re-calculate the total number of votes per option';

    public function handle(): int
    {
        $progress = $this->output->createProgressBar(Poll::query()->count() + PollOption::query()->count());

        // Counted with each chunk, not one query per poll or option.
        Poll::query()->withCount('votes')->each(function (Poll $poll) use ($progress) {
            $poll->vote_count = (int) $poll->votes_count;
            $poll->save();

            $progress->advance();
        });

        PollOption::query()->withCount('votes')->each(function (PollOption $option) use ($progress) {
            $option->vote_count = (int) $option->votes_count;
            $option->save();

            $progress->advance();
        });

        $progress->finish();

        $this->info('Done.');

        return 0;
    }
}
