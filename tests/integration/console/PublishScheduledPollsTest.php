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

use Carbon\Carbon;
use Flarum\Testing\integration\TestCase;
use FoF\Polls\Console\PublishScheduledPollsCommand;
use FoF\Polls\Poll;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

class PublishScheduledPollsTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->setting('fof-polls.enableGlobalPolls', true);

        $past = Carbon::now()->subMinute()->toDateTimeString();

        $this->prepareDatabase([
            'users' => [
                ['id' => 3, 'username' => 'author', 'email' => 'author@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'polls' => [
                // 20 = due, valid, 2 options
                ['id' => 20, 'question' => 'Due Valid', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => $past, 'scheduled_publish_error' => null],
                // 21 = due, 0 options → should error
                ['id' => 21, 'question' => 'Due Empty', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => $past, 'scheduled_publish_error' => null],
                // 22 = previously errored, should be skipped
                ['id' => 22, 'question' => 'Previously Errored', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => $past, 'scheduled_publish_error' => 'whatever'],
            ],
            'poll_options' => [
                ['id' => 200, 'answer' => 'A', 'poll_id' => 20, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 201, 'answer' => 'B', 'poll_id' => 20, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 202, 'answer' => 'A', 'poll_id' => 22, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 203, 'answer' => 'B', 'poll_id' => 22, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
        ]);
    }

    protected function runCommand(): void
    {
        $container = $this->app()->getContainer();
        /** @var PublishScheduledPollsCommand $command */
        $command = $container->make(PublishScheduledPollsCommand::class);
        // Laravel's base Command::run() resolves OutputStyle via $this->laravel;
        // when we bypass the Console kernel we must wire the container ourselves.
        $command->setLaravel($container);
        $command->run(new ArrayInput([]), new NullOutput());
    }

    public function test_scheduled_valid_draft_is_published(): void
    {
        $this->runCommand();

        $poll = Poll::find(20);
        $this->assertNotNull($poll->published_at);
        $this->assertNull($poll->scheduled_publish_at);
        $this->assertNull($poll->scheduled_publish_error);
    }

    public function test_scheduled_invalid_draft_gets_error_and_stays_draft(): void
    {
        $this->runCommand();

        $poll = Poll::find(21);
        $this->assertNull($poll->published_at);
        $this->assertNotNull($poll->scheduled_publish_error);
        $this->assertStringContainsStringIgnoringCase('options', $poll->scheduled_publish_error);
    }

    public function test_previously_errored_scheduled_draft_is_skipped_on_next_run(): void
    {
        $this->runCommand();

        $poll = Poll::find(22);
        $this->assertNull($poll->published_at);
        $this->assertNotNull($poll->scheduled_publish_at);
        $this->assertEquals('whatever', $poll->scheduled_publish_error);
    }
}
