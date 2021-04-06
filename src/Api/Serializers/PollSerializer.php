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
        return [
            'question'    => $poll->question,
            'hasEnded'    => $poll->hasEnded(),
            'publicPoll'  => (bool) $poll->public_poll,
            'voteCount'   => (int) $poll->vote_count,
            'endDate'     => $this->formatDate($poll->end_date),
            'createdAt'   => $this->formatDate($poll->created_at),
            'updatedAt'   => $this->formatDate($poll->updated_at),
        ];
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
