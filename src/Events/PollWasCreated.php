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

class PollWasCreated
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
     * PollWasCreated constructor.
     *
     * @param User $actor
     * @param Poll $poll
     */
    public function __construct(User $actor, Poll $poll)
    {
        $this->actor = $actor;
        $this->poll = $poll;
    }
}
