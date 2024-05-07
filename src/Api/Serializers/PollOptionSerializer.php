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
            'createdAt'   => $this->formatDate($option->created_at),
            'updatedAt'   => $this->formatDate($option->updated_at),
            'voteCount'   => $this->actor->can('seeVoteCount', $option->poll) ? (int) $option->vote_count : null,
        ];

        return $attributes;
    }

    protected function getImageUrl(PollOption $option): ?string
    {
        // early return if no image
        if (!$option->image_url) {
            return null;
        }

        // if the value is a fully qualified URL, return it as is
        if (filter_var($option->image_url, FILTER_VALIDATE_URL)) {
            return $option->image_url;
        }

        //if the value is a filename, generate the URL to the polls storage disk
        /** @var Cloud */
        $fileSystem = resolve(Factory::class)->disk('fof-polls');

        if ($fileSystem->exists($option->image_url)) {
            return $fileSystem->url($option->image_url);
        }

        return null;
    }
}
