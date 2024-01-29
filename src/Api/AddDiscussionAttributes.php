<?php

namespace FoF\Polls\Api;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;

class AddDiscussionAttributes
{
    public function __invoke(DiscussionSerializer $serializer, Discussion $discussion, array $attributes): array
    {
        $attributes['hasPoll'] = $discussion->polls()->exists();
        $attributes['canStartPoll'] = $serializer->getActor()->can('polls.start', $discussion);

        return $attributes;
    }
}
