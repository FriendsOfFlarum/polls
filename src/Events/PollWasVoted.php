<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Events;

use Flarum\User\User;
use FoF\Polls\Poll;
use FoF\Polls\PollVote;

class PollWasVoted
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var Poll
     */
    public $poll;

    /**
     * @var Vote
     */
    public $vote;

    /**
     * @var bool
     */
    public $changed;

    /**
     * PollWasCreated constructor.
     *
     * @param User     $actor
     * @param Poll     $poll
     * @param PollVote $vote
     * @param bool     $changed
     */
    public function __construct(User $actor, Poll $poll, PollVote $vote, $changed = false)
    {
        $this->actor = $actor;
        $this->poll = $poll;
        $this->vote = $vote;
        $this->changed = $changed;
    }
}
