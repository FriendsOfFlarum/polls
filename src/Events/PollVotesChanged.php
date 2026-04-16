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
use Illuminate\Support\Collection;

class PollVotesChanged
{
    /**
     * PollWasCreated constructor.
     */
    public function __construct(public User $actor, public Poll $poll, public Collection $unvotedOptionIds, public Collection $votedOptionIds)
    {
    }
}
