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
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use InvalidArgumentException;

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
        if (!($poll instanceof Poll)) {
            throw new InvalidArgumentException(
                get_class($this).' can only serialize instances of '.Poll::class
            );
        }

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
            'image'              => $poll->image,
            'imageUrl'           => $this->getImageUrl($poll),
            'imageAlt'           => $poll->image_alt,
            'publicPoll'         => $poll->public_poll,
        ];

        if ($this->actor->can('seeVoteCount', $poll)) {
            $attributes['voteCount'] = (int) $poll->vote_count;
        }

        if ($canEdit) {
            $attributes['hideVotes'] = $poll->hide_votes;
            $attributes['allowChangeVote'] = $poll->allow_change_vote;
        }

        if ($attributes['image']) {
            $attributes['isImageUpload'] = !filter_var($poll->image, FILTER_VALIDATE_URL);
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
        if (!($model instanceof Poll)) {
            return null;
        }

        Poll::setStateUser($this->actor);

        // When called inside ShowDiscussionController, Flarum has already pre-loaded our relationship incorrectly
        $model->unsetRelation('myVotes');

        return $this->hasMany(
            $model,
            PollVoteSerializer::class
        );
    }

    public function pollGroup($model)
    {
        return $this->hasOne(
            $model,
            PollGroupSerializer::class
        );
    }

    protected function getImageUrl(Poll $poll): ?string
    {
        // early return if no image
        if ($poll->image === null) {
            return null;
        }

        // if image is a URL, return it
        if (filter_var($poll->image, FILTER_VALIDATE_URL)) {
            return $poll->image;
        }

        /** @var Cloud */
        $fileSystem = resolve(Factory::class)->disk('fof-polls');

        if ($fileSystem->exists($poll->image)) {
            return $fileSystem->url($poll->image);
        }

        return null;
    }
}
