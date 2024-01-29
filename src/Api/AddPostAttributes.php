<?php

namespace FoF\Polls\Api;

class AddPostAttributes
{
    public function __invoke($serializer, $post, $attributes)
    {
        $attributes['canStartPoll'] = $serializer->getActor()->can('startPoll', $post);

        return $attributes;
    }
}
