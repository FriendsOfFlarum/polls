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
use PHPUnit\Framework\TestCase;

class PollDraftStateTest extends TestCase
{
    public function test_global_poll_with_null_published_at_is_draft(): void
    {
        $poll = new Poll();
        $poll->post_id = null;
        $poll->published_at = null;

        $this->assertTrue($poll->isDraft());
    }

    public function test_global_poll_with_published_at_is_not_draft(): void
    {
        $poll = new Poll();
        $poll->post_id = null;
        $poll->published_at = Carbon::now();

        $this->assertFalse($poll->isDraft());
    }

    public function test_discussion_poll_is_never_draft(): void
    {
        $poll = new Poll();
        $poll->post_id = 42;
        $poll->published_at = null;

        $this->assertFalse($poll->isDraft());
    }

    public function test_isScheduled_requires_draft_and_scheduled_at(): void
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
