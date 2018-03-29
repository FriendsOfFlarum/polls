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
use Reflar\Polls\Validators\VoteValidator;
use Reflar\Polls\Vote;

class VoteRepository
{
    /**
     * @var Vote
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

    public function __construct(Vote $field, VoteValidator $validator, Repository $cache)
    {
        $this->field = $field;
        $this->validator = $validator;
        $this->cache = $cache;
    }

    protected function query()
    {
        return $this->field
            ->newQuery()
            ->orderBy('created_at', 'desc');
    }

    public function findVote($pollId, $userId)
    {
        return Vote::where('poll_id', $pollId)
            ->where('user_id', $userId)
            ->get();
    }

    public function findDuplicate($pollId, $userId)
    {
        return Vote::where('poll_id', $pollId)
            ->where('user_id', $userId)
            ->count();
    }

    public function all()
    {
        return $this->query()->get();
    }

    public function store(array $attributes)
    {
        if ($this->findDuplicate($attributes['poll_id'], $attributes['user_id']) == 0) {
            $answer = new Vote($attributes);
            $answer->save();

            return $answer;
        }
    }
}
