<?php

namespace Treefiction\Polls\Api\Serializers;

use Treefiction\Polls\Field;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class VoteSerializer extends AbstractSerializer
{
    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param Field|array $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param Field $model
     * @return string
     */
    public function getType($model)
    {
        return 'treefiction-polls-vote';
    }

    public function question($model)
    {
        return $this->hasOne(
            $model,
            QuestionSerializer::class,
            'poll_id'
        );
    }
}
