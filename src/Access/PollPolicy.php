<?php

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
