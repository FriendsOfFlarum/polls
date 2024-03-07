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
use FoF\Polls\PollOption;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class PollOptionSerializer extends AbstractSerializer
{
    /**
     * @var string
     */
    protected $type = 'poll_options';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param PollOption $option
     *
     * @return array
     */
    protected function getDefaultAttributes($option)
    {
        $attributes = [
            'answer'      => $option->answer,
            'imageUrl'    => $this->getImageUrl($option),
            'imageAlt'    => $option->image_alt,
            'createdAt'   => $this->formatDate($option->created_at),
            'updatedAt'   => $this->formatDate($option->updated_at),
            'voteCount'   => $this->actor->can('seeVoteCount', $option->poll) ? (int) $option->vote_count : null,
        ];

        return $attributes;
    }

    protected function getImageUrl(PollOption $pollOption): ?string
    {
        // early return if no image
        if ($pollOption->image === null) {
            return null;
        }

        /** @var Cloud */
        $fileSystem = resolve(Factory::class)->disk('fof-polls');
        $filePath = "pollOptions/{$pollOption->poll_id}/{$pollOption->image}";

        if ($fileSystem->exists($filePath)) {
            return $fileSystem->url($filePath);
        }

        return null;
    }
}
