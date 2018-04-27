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
use Reflar\Polls\Question;

class QuestionRepository
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
     * QuestionRepository constructor.
     *
     * @param Question   $field
     * @param Repository $cache
     */
    public function __construct(Question $field, Repository $cache)
    {
        $this->field = $field;
        $this->cache = $cache;
    }

    /**
     * @return mixed
     */
    protected function query()
    {
        return $this->field
            ->newQuery()
            ->orderBy('question', 'desc');
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
     * @return mixed
     */
    public function all()
    {
        return $this->query()->get();
    }

    /**
     * @param $id
     */
    public function deletePoll($id)
    {
        $poll = $this->field->find($id);

        $poll->votes()->delete(); // Delete all votes
        $poll->answers()->delete(); // Delete all answers
        $poll->delete(); // Delete poll
    }
}
