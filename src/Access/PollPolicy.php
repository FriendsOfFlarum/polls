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
        if ($poll->myVotes($actor)->count() || $actor->can('polls.viewResultsWithoutVoting', $poll->post->discussion)) {
            return $this->allow();
        }
    }

    public function seeVoters(User $actor, Poll $poll)
    {
        if (($poll->myVotes($actor)->count() || $actor->can('polls.viewResultsWithoutVoting', $poll->post->discussion)) && $poll->public_poll) {
            return $this->allow();
        }
    }

    public function view(User $actor, Poll $poll)
    {
        if ($actor->can('view', $poll->post)) {
            return $this->allow();
        }
    }

    public function vote(User $actor, Poll $poll)
    {
        if ($actor->can('polls.vote', $poll->post->discussion) && !$poll->hasEnded()) {
            return $this->allow();
        }
    }

    public function changeVote(User $actor, Poll $poll)
    {
        if ($actor->hasPermission('polls.changeVote')) {
            return $this->allow();
        }
    }

    public function edit(User $actor, Poll $poll)
    {
        if ($actor->can('polls.moderate', $poll->post->discussion)) {
            return $this->allow();
        }

        if ($actor->hasPermission('polls.selfEdit') && !$poll->hasEnded() && $actor->can('edit', $poll->post)) {
            $ownerId = $poll->post->user_id;

            if ($ownerId && $ownerId === $actor->id) {
                return $this->allow();
            }
        }
    }

    public function delete(User $actor, Poll $poll)
    {
        return $this->edit($actor, $poll);
    }
}
