<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use FoF\Polls\Poll;

class PollPolicy extends AbstractPolicy
{
    public function seeVoteCount(User $actor, Poll $poll)
    {
        if ($actor->can('viewPollResultsWithoutVoting')) {
            return $this->allow();
        }

        if ($poll->myVotes($actor)->count()) {
            return $this->allow();
        }
    }

    public function seeVotes(User $actor, Poll $poll)
    {
        if ($actor->can('viewPollResultsWithoutVoting')) {
            return $this->allow();
        }

        if ($poll->myVotes($actor)->count() && $poll->public_poll) {
            return $this->allow();
        }
    }

    public function changeVote(User $actor, Poll $poll)
    {
        if ($actor->hasPermission('changeVotePolls')) {
            return $this->allow();
        }
    }
}
