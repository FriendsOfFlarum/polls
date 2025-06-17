<?php

namespace FoF\Polls\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use FoF\Polls\PollGroup;
use InvalidArgumentException;

class PollGroupSerializer extends AbstractSerializer
{
    protected $type = 'poll-groups';

    protected function getDefaultAttributes($group)
    {
        if (!($group instanceof PollGroup)) {
            throw new InvalidArgumentException(
                get_class($this).' can only serialize instances of '.PollGroup::class
            );
        }

        return [
            'name'        => $group->name,
            'createdAt'   => $this->formatDate($group->created_at),
        ];
    }

    protected function user($group)
    {
        return $this->hasOne($group, BasicUserSerializer::class);
    }

    protected function polls($group)
    {
        return $this->hasMany($group, PollSerializer::class);
    }
}