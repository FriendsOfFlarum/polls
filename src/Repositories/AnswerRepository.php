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

namespace Reflar\Polls\Repositories;

use Illuminate\Cache\Repository;
use Reflar\Polls\Answer;
use Reflar\Polls\Question;

class AnswerRepository
{
    /**
     * @var Field
     */
    protected $field;

    /**
     * @var Repository
     */
    protected $cache;

    /**
     * AnswerRepository constructor.
     *
     * @param Question $field
     * @param Repository $cache
     */
    public function __construct(Question $field, Repository $cache)
    {
        $this->field = $field;
        $this->cache = $cache;
    }

    /**
     * @param Question $question
     *
     * @return mixed
     */
    protected function query(Question $question)
    {
        return $question
            ->answers()
            ->orderBy('created_at', 'desc');
    }

    /**
     * @param $id
     *
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model
     */
    public function findOrFail($id)
    {
        return $this->field
            ->newQuery()
            ->findOrFail($id);
    }

    /**
     * @param Question $question
     *
     * @return mixed
     */
    public function all(Question $question)
    {
        return $this->query($question)->get();
    }

    /**
     * @param $answerId
     */
    public function deleteAnswer($answerId)
    {
        $answer = Answer::find($answerId);

        $answer->votes()->delete(); // Delete all votes
        $answer->delete(); // Delete answer
    }
}