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
use Reflar\Polls\Validators\FieldValidator;

class AnswerRepository
{
    /**
     * @var Field
     */
    protected $field;

    /**
     * @var FieldValidator
     */
    protected $validator;

    /**
     * @var Repository
     */
    protected $cache;

    public function __construct(Question $field, Repository $cache)
    {
        $this->field = $field;
        $this->cache = $cache;
    }

    protected function query(Question $question)
    {
        return $question
            ->answers()
            ->orderBy('created_at', 'desc');
    }

    public function findOrFail($id)
    {
        return $this->field
            ->newQuery()
            ->findOrFail($id);
    }

    public function all(Question $question)
    {
        return $this->query($question)->get();
    }
}
