<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api;

class AddPostAttributes
{
    public function __invoke($serializer, $post, $attributes)
    {
        $attributes['canStartPoll'] = $serializer->getActor()->can('startPoll', $post);

        return $attributes;
    }
}
