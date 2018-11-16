<?php
/**
 *  This file is part of reflar/polls.
 *
 *  Copyright (c) ReFlar.
 *
 *  https://reflar.redevs.org
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Polls\Events;

use Flarum\User\User;
use Reflar\Polls\Question;
use Reflar\Polls\Vote;

class PollWasVoted
{
    /**
     * @var Vote
     */
    public $vote;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var Question
     */
    public $poll;

    /**
     * @var bool
     */
    public $changed;

    /**
     * PollWasVoted constructor.
     *
     * @param Vote     $vote
     * @param Question $poll
     * @param User     $actor
     * @param bool     $changed
     */
    public function __construct(Vote $vote, Question $poll, User $actor, $changed = false)
    {
        $this->vote = $vote;
        $this->poll = $poll;
        $this->actor = $actor;
        $this->changed = $changed;
    }
}
