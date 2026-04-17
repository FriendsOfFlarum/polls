<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Events;

use Flarum\User\User;
use FoF\Polls\Poll;

class PollWasPublished
{
    /**
     * @var Poll
     */
    public $poll;

    /**
     * @var User|null
     */
    public $actor;

    /**
     * @param Poll      $poll
     * @param User|null $actor
     */
    public function __construct(Poll $poll, ?User $actor = null)
    {
        $this->poll = $poll;
        $this->actor = $actor;
    }
}
