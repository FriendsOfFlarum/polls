<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Polls\Poll;

class PollSerializer extends AbstractSerializer
{
    /**
     * @var string
     */
    protected $type = 'polls';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param Poll $poll
     *
     * @return array
     */
    protected function getDefaultAttributes($poll)
    {
        $canEdit = $this->actor->can('edit', $poll);

        $attributes = [
            'question'           => $poll->question,
            'subtitle'           => $poll->subtitle,
            'hasEnded'           => $poll->hasEnded(),
            'allowMultipleVotes' => $poll->allow_multiple_votes,
            'maxVotes'           => $poll->max_votes,
            'endDate'            => $this->formatDate($poll->end_date),
            'createdAt'          => $this->formatDate($poll->created_at),
            'updatedAt'          => $this->formatDate($poll->updated_at),
            'canVote'            => $this->actor->can('vote', $poll),
            'canEdit'            => $canEdit,
            'canDelete'          => $this->actor->can('delete', $poll),
            'canSeeVoters'       => $this->actor->can('seeVoters', $poll),
            'canChangeVote'      => $this->actor->can('changeVote', $poll),
            'isGlobal'           => $poll->isGlobal(),
        ];

        if ($this->actor->can('seeVoteCount', $poll)) {
            $attributes['voteCount'] = (int) $poll->vote_count;
        }

        if ($canEdit) {
            $attributes['publicPoll'] = $poll->public_poll;
            $attributes['hideVotes'] = $poll->hide_votes;
            $attributes['allowChangeVote'] = $poll->allow_change_vote;
        }

        return $attributes;
    }

    public function options($model)
    {
        return $this->hasMany(
            $model,
            PollOptionSerializer::class
        );
    }

    public function votes($model)
    {
        if ($this->actor->cannot('seeVoters', $model)) {
            return null;
        }

        return $this->hasMany(
            $model,
            PollVoteSerializer::class
        );
    }

    public function myVotes($model)
    {
        Poll::setStateUser($this->actor);

        // When called inside ShowDiscussionController, Flarum has already pre-loaded our relationship incorrectly
        $model->unsetRelation('myVotes');

        return $this->hasMany(
            $model,
            PollVoteSerializer::class
        );
    }
}
