<?php

namespace Treefiction\Polls\Repositories;

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

    protected function query()
    {
        return $this->field
            ->newQuery()
            ->orderBy('question', 'desc')
        ;
    }


    public function findOrFail($id)
    {
        return $this->field
            ->newQuery()
            ->findOrFail($id)
        ;
    }

    public function all()
    {
        return $this->query()->get();
    }

    public function editPoll($id, $data)
    {
        $poll = $this->field->find($id);
        // foreach (array_filter($post['answers']) as $answer) {;
        // $poll->question = $data['question'];
        // $poll->save();
    }

    public function deletePoll($id)
    {
        $poll = $this->field->find($id);

        $poll->votes()->delete(); // Delete all votes
        $poll->answers()->delete(); // Delete all answers
        $poll->delete(); // Delete poll
    }

}
