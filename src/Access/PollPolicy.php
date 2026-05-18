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
use Illuminate\Support\Arr;

class PollPolicy extends AbstractPolicy
{
    public function seeVoteCount(User $actor, Poll $poll): string|bool|null
    {
        $isPollAuthor = $actor->id === $poll->user_id;

        if ($poll->hide_votes && $poll->end_date && !$poll->hasEnded() && !$isPollAuthor) {
            return $this->deny();
        }

        if ($poll->myVotes($actor)->count() || $actor->can('polls.viewResultsWithoutVoting', $poll->post !== null ? $poll->post->discussion : null) || $poll->isGlobal() || $isPollAuthor) {
            return $this->allow();
        }

        return null;
    }

    public function seeVoters(User $actor, Poll $poll): string|bool|null
    {
        if (!$actor->can('seeVoteCount', $poll)) {
            return $this->deny();
        }

        if ($poll->public_poll) {
            return $this->allow();
        }

        return null;
    }

    public function view(User $actor, Poll $poll): string|bool|null
    {
        if ($poll->isDraft() && !$actor->can('edit', $poll)) {
            return $this->deny();
        }

        if ($actor->can('view', $poll->post) || $poll->isGlobal()) {
            return $this->allow();
        }

        return null;
    }

    public function vote(User $actor, Poll $poll): string|bool|null
    {
        $discussion = $poll->post !== null ? $poll->post->discussion : null;
        $can = $discussion ? $actor->can('polls.vote', $discussion) : $actor->can('discussion.polls.vote', $discussion);

        if (($can || $poll->isGlobal()) && !$poll->hasEnded()) {
            return $this->allow();
        }

        return null;
    }

    public function changeVote(User $actor, Poll $poll): string|bool|null
    {
        if ($actor->hasPermission('polls.changeVote')) {
            return $this->allow();
        }

        return (bool) Arr::get($poll->settings, 'allow_change_vote', false);
    }

    public function edit(User $actor, Poll $poll): string|bool|null
    {
        if ($actor->can('polls.moderate', $poll->post !== null ? $poll->post->discussion : null)) {
            return $this->allow();
        }

        if (!$poll->isGlobal() && !$poll->hasEnded() && $actor->can('edit', $poll->post)) {
            // User either created poll & can edit own poll or can edit all polls in post
            if (($actor->id === $poll->user_id && $actor->hasPermission('polls.selfEdit'))
                || ($actor->id == $poll->post->user_id && $actor->hasPermission('polls.selfPostEdit'))
            ) {
                return $this->allow();
            }
        }

        if ($poll->isGlobal()) {
            return $actor->id === $poll->user_id && $actor->hasPermission('polls.selfEdit');
        }

        return null;
    }

    public function delete(User $actor, Poll $poll): string|bool|null
    {
        return $this->edit($actor, $poll);
    }

    public function publish(User $actor, Poll $poll): string|bool|null
    {
        if (!$poll->isDraft()) {
            return $this->deny();
        }

        // Same baseline as edit.
        return $this->edit($actor, $poll);
    }

    public function unpublish(User $actor, Poll $poll): string|bool|null
    {
        if ($poll->isDraft()) {
            return $this->deny();
        }

        if ($poll->vote_count > 0) {
            return $this->deny();
        }

        return $this->edit($actor, $poll);
    }
}
