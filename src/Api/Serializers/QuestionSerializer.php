<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * https://reflar.redevs.org
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
     * @param array|object $question
     *
     * @return array
     */
    protected function getDefaultAttributes($question)
    {
        return [
            'discussion_id' => $question->discussion_id,
            'question'      => $question->question,
            'isEnded'       => $question->isEnded(),
            'endDate'       => $question->end_date.' UTC',
            'isPublic'      => (bool) $question->public_poll,
        ];
    }

    /**
     * @param $question
     *
     * @return Relationship
     */
    public function answers($question)
    {
        $answers = app(AnswerRepository::class);

        return new Relationship(new Collection($answers->all($question), app(AnswerSerializer::class)));
    }

    /**
     * @param $question
     *
     * @return Relationship
     */
    public function votes($question)
    {
        $votes = app(VoteRepository::class);

        return new Relationship(new Collection($votes->getReleventVotes($question->id), app(VoteSerializer::class)));
    }
}
