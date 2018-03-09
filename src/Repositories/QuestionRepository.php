<?php

namespace Treefiction\Polls\Repositories;

use Treefiction\Polls\Answer;
use Treefiction\Polls\Question;
use Treefiction\Polls\Validators\FieldValidator;
use Flarum\Core\User;
use Illuminate\Cache\Repository;
use Illuminate\Support\Arr;
use Validator;

class QuestionRepository
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

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function query()
    {
        return $this->field
            ->newQuery()
            ->orderBy('question', 'desc')
        ;
    }

    /**
     * @param $id
     * @return Field
     */
    public function findOrFail($id)
    {
        return $this->field
            ->newQuery()
            ->findOrFail($id)
        ;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|Field[]
     */
    public function all()
    {
        return $this->query()->get();
    }

}
