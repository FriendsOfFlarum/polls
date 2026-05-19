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
use PHPUnit\Framework\Attributes\Test;
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
                ['id' => 20, 'question' => 'Due Valid', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => $past, 'scheduled_publish_error' => null],
                ['id' => 21, 'question' => 'Due Empty', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => $past, 'scheduled_publish_error' => null],
                ['id' => 22, 'question' => 'Previously Errored', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => $past, 'scheduled_publish_error' => 'whatever'],
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
        $command->setLaravel($container);
        $command->run(new ArrayInput([]), new NullOutput());
    }

    #[Test]
    public function scheduledValidDraftIsPublished(): void
    {
        $this->runCommand();

        $poll = Poll::find(20);
        $this->assertNotNull($poll->published_at);
        $this->assertNull($poll->scheduled_publish_at);
        $this->assertNull($poll->scheduled_publish_error);
    }

    #[Test]
    public function scheduledInvalidDraftGetsErrorAndStaysDraft(): void
    {
        $this->runCommand();

        $poll = Poll::find(21);
        $this->assertNull($poll->published_at);
        $this->assertNotNull($poll->scheduled_publish_error);
        $this->assertStringContainsStringIgnoringCase('options', $poll->scheduled_publish_error);
    }

    #[Test]
    public function previouslyErroredScheduledDraftIsSkippedOnNextRun(): void
    {
        $this->runCommand();

        $poll = Poll::find(22);
        $this->assertNull($poll->published_at);
        $this->assertNotNull($poll->scheduled_publish_at);
        $this->assertEquals('whatever', $poll->scheduled_publish_error);
    }
}
