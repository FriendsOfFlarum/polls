<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\unit;

use Carbon\Carbon;
use FoF\Polls\Poll;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class PollDraftStateTest extends TestCase
{
    #[Test]
    public function globalPollWithNullPublishedAtIsDraft(): void
    {
        $poll = new Poll();
        $poll->post_id = null;
        $poll->published_at = null;

        $this->assertTrue($poll->isDraft());
    }

    #[Test]
    public function globalPollWithPublishedAtIsNotDraft(): void
    {
        $poll = new Poll();
        $poll->post_id = null;
        $poll->published_at = Carbon::now();

        $this->assertFalse($poll->isDraft());
    }

    #[Test]
    public function discussionPollIsNeverDraft(): void
    {
        $poll = new Poll();
        $poll->post_id = 42;
        $poll->published_at = null;

        $this->assertFalse($poll->isDraft());
    }

    #[Test]
    public function isScheduledRequiresDraftAndScheduledAt(): void
    {
        $poll = new Poll();
        $poll->post_id = null;
        $poll->published_at = null;
        $poll->scheduled_publish_at = Carbon::now()->addDay();

        $this->assertTrue($poll->isScheduled());

        $poll->scheduled_publish_at = null;
        $this->assertFalse($poll->isScheduled());
    }
}
