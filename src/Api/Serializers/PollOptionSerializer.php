<?php


namespace FoF\Polls\Api\Serializers;


use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Polls\PollOption;

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
     * @return array
     */
    protected function getDefaultAttributes($option)
    {
        return [
            'answer' => $option->answer,
            'createdAt' => $this->formatDate($option->created_at),
            'updatedAt' => $this->formatDate($option->updated_at),
        ];
    }
}