<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */
namespace Reflar\Polls\Api\Serializers;

use Reflar\Polls\Repositories\AnswerRepository;
use Reflar\Polls\Repositories\VoteRepository;
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
        return 'reflar-polls-question';
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
