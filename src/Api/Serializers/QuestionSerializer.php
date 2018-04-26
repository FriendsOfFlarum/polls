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

use Flarum\Api\Serializer\AbstractSerializer;
use Reflar\Polls\Repositories\AnswerRepository;
use Reflar\Polls\Repositories\VoteRepository;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class QuestionSerializer extends AbstractSerializer
{
    /**
     * @var string
     */
    protected $type = 'questions';

    /**
     * @param array|object $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param $model
     * @return Relationship
     */
    public function answers($model)
    {
        $answers = app(AnswerRepository::class);

        return new Relationship(new Collection($answers->all($model), app(AnswerSerializer::class)));
    }

    /**
     * @param $model
     * @return Relationship
     */
    public function votes($model)
    {
        $votes = app(VoteRepository::class);

        return new Relationship(new Collection($votes->all($model), app(VoteSerializer::class)));
    }
}
