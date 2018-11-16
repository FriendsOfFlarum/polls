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

namespace Reflar\Polls\Repositories;

use Illuminate\Cache\Repository;
use Reflar\Polls\Vote;

class VoteRepository
{
    /**
     * @var Vote
     */
    protected $field;

    /**
     * @var Repository
     */
    protected $cache;

    /**
     * VoteRepository constructor.
     *
     * @param Vote       $field
     * @param Repository $cache
     */
    public function __construct(Vote $field, Repository $cache)
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
            ->orderBy('created_at', 'desc');
    }

    /**
     * @param $pollId
     * @param $userId
     *
     * @return mixed
     */
    public function findVote($pollId, $userId)
    {
        return Vote::where('poll_id', $pollId)
            ->where('user_id', $userId)
            ->get();
    }

    /**
     * @param $pollId
     * @param $userId
     *
     * @return mixed
     */
    public function findDuplicate($pollId, $userId)
    {
        return Vote::where('poll_id', $pollId)
            ->where('user_id', $userId)
            ->count();
    }

    /**
     * @return mixed
     */
    public function all()
    {
        return $this->query()->get();
    }

    /**
     * @param $questionId
     *
     * @return mixed
     */
    public function getReleventVotes($questionId)
    {
        return vote::where('poll_id', $questionId)->get();
    }
}
