<?php

namespace Treefiction\Polls\Api\Serializers;

use Treefiction\Polls\Repositories\AnswerRepository;
use Treefiction\Polls\Repositories\VoteRepository;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class QuestionSerializer extends AbstractSerializer
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
        return 'treefiction-polls-question';
    }

    public function answers($model)
    {
        $answers = app(AnswerRepository::class);
        return new Relationship(new Collection($answers->all($model), app(AnswerSerializer::class)));
    }

    public function votes($model)
    {
        $votes = app(VoteRepository::class);
        return new Relationship(new Collection($votes->all($model), app(VoteSerializer::class)));
    }
}
