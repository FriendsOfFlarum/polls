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
        if ($poll->hide_votes && $poll->end_date && !$poll->hasEnded()) {
            return $this->deny();
        }

        if ($poll->myVotes($actor)->count() || $actor->can('polls.viewResultsWithoutVoting', $poll->post !== null ? $poll->post->discussion : null)) {
            return $this->allow();
        }
    }

    public function seeVoters(User $actor, Poll $poll)
    {
        if (!$actor->can('seeVoteCount', $poll)) {
            return $this->deny();
        }

        if ($poll->public_poll) {
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
        $discussion = $poll->post !== null ? $poll->post->discussion : null;
        $can = $discussion ? $actor->can('polls.vote', $discussion) : $actor->can('discussion.polls.vote', $discussion);

        if ($can && !$poll->hasEnded()) {
            return $this->allow();
        }
    }

    public function changeVote(User $actor, Poll $poll)
    {
        if ($poll->allow_change_vote && $actor->hasPermission('polls.changeVote')) {
            return $this->allow();
        }
    }

    public function edit(User $actor, Poll $poll)
    {
        if ($actor->can('polls.moderate', $poll->post !== null ? $poll->post->discussion : null)) {
            return $this->allow();
        }

        if (!$poll->hasEnded() && $actor->can('edit', $poll->post)) {
            // User either created poll & can edit own poll or can edit all polls in post
            if (($actor->id === $poll->user_id && $actor->hasPermission('polls.selfEdit'))
                || ($actor->id == $poll->post->user_id && $actor->hasPermission('polls.selfPostEdit'))
            ) {
                return $this->allow();
            }
        }
    }

    public function delete(User $actor, Poll $poll)
    {
        return $this->edit($actor, $poll);
    }
}
