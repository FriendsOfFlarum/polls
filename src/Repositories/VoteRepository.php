<?php

namespace Treefiction\Polls\Repositories;

use Treefiction\Polls\Vote;
use Treefiction\Polls\Validators\VoteValidator;
use Illuminate\Cache\Repository;
use Illuminate\Support\Arr;
use Validator;

class VoteRepository
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

    public function __construct(Vote $field,  VoteValidator $validator, Repository $cache)
    {
        $this->field = $field;
        $this->validator = $validator;
        $this->cache = $cache;
    }

    protected function query()
    {
        return $this->field
            ->newQuery()
            ->orderBy('created_at', 'desc')
        ;
    }

    public function findVote($pollId, $userId)
    {
        return Vote::where('poll_id', $pollId)
            ->where('user_id', $userId)
            ->get()
        ;
    }

    public function findDuplicate($pollId, $userId)
    {
        return Vote::where('poll_id', $pollId)
            ->where('user_id', $userId)
            ->count()
        ;
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
