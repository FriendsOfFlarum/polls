<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\integration\console;

use Flarum\Testing\integration\TestCase;
use FoF\Polls\Console\RefreshVoteCountCommand;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use FoF\Polls\PollVote;
use FoF\Polls\Tests\integration\InspectsQueries;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

class RefreshVoteCountTest extends TestCase
{
    use InspectsQueries;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $polls = [];
        $options = [];
        $votes = [];

        // Every poll and option starts with a wrong count; poll N has N votes,
        // all on its first option.
        for ($id = 1; $id <= 6; $id++) {
            $polls[] = ['id' => $id, 'question' => "Poll $id", 'user_id' => 1, 'vote_count' => 99];
            $options[] = ['id' => $id * 10, 'answer' => 'Yes', 'poll_id' => $id, 'vote_count' => 99];
            $options[] = ['id' => $id * 10 + 1, 'answer' => 'No', 'poll_id' => $id, 'vote_count' => 99];

            for ($n = 1; $n <= $id; $n++) {
                $votes[] = ['id' => $id * 10 + $n, 'poll_id' => $id, 'option_id' => $id * 10, 'user_id' => null];
            }
        }

        $this->prepareDatabase([
            Poll::class       => $polls,
            PollOption::class => $options,
            PollVote::class   => $votes,
        ]);
    }

    protected function runCommand(): void
    {
        $container = $this->app()->getContainer();
        /** @var RefreshVoteCountCommand $command */
        $command = $container->make(RefreshVoteCountCommand::class);
        $command->setLaravel($container);
        $command->run(new ArrayInput([]), new NullOutput());
    }

    #[Test]
    public function votes_are_recounted_for_every_poll_and_option(): void
    {
        $this->runCommand();

        for ($id = 1; $id <= 6; $id++) {
            $this->assertSame($id, (int) Poll::query()->find($id)->vote_count, "Poll $id");
            $this->assertSame($id, (int) PollOption::query()->find($id * 10)->vote_count, "Poll $id's first option");
            $this->assertSame(0, (int) PollOption::query()->find($id * 10 + 1)->vote_count, "Poll $id's second option");
        }
    }

    #[Test]
    public function votes_are_counted_with_the_polls_and_options_not_once_per_row(): void
    {
        $voteQueries = array_values(array_filter(
            $this->queriesDuring(fn () => $this->runCommand()),
            fn (string $sql) => $this->selectsFrom($sql) === 'poll_votes'
        ));

        $this->assertSame([], $voteQueries);
    }
}
