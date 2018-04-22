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
    protected $type = 'questions';

    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
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
