<?php

namespace FoF\Polls\Api;

use Flarum\Api\Serializer\ForumSerializer;

class AddForumAttributes
{
    public function __invoke(ForumSerializer $serializer, array $model, array $attributes): array
    {
        $attributes['canStartPolls'] = $serializer->getActor()->can('discussion.polls.start');

        return $attributes;
    }
}
