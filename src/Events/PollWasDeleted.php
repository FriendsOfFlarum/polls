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

/**
 * Dispatched after a poll is deleted through the API. The row is gone; the
 * model keeps its attributes.
 */
class PollWasDeleted
{
    public function __construct(public User $actor, public Poll $poll)
    {
    }
}
