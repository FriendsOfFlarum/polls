<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use FoF\Polls\Events\PollWasUnpublished;
use FoF\Polls\Poll;
use FoF\Polls\PollRepository;
use Illuminate\Contracts\Events\Dispatcher;

class UnpublishPollHandler
{
    /**
     * @var PollRepository
     */
    protected $polls;

    /**
     * @var Dispatcher
     */
    protected $events;

    public function __construct(PollRepository $polls, Dispatcher $events)
    {
        $this->polls = $polls;
        $this->events = $events;
    }

    public function handle(UnpublishPoll $command): Poll
    {
        $poll = $this->polls->findOrFail($command->pollId, $command->actor);

        // Policy enforces: isDraft check (403), vote_count > 0 guard (403),
        // and edit baseline. See PollPolicy::unpublish.
        $command->actor->assertCan('unpublish', $poll);

        $poll->published_at = null;
        $poll->scheduled_publish_at = null;
        $poll->scheduled_publish_error = null;
        $poll->save();

        $this->events->dispatch(new PollWasUnpublished($poll, $command->actor));

        return $poll;
    }
}
