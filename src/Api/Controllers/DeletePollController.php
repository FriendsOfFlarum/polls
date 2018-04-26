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

namespace Reflar\Polls\Api\Controllers;

use Flarum\Api\Controller\AbstractDeleteController;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Question;
use Reflar\Polls\Repositories\QuestionRepository;

class DeletePollController extends AbstractDeleteController
{
    /**
     * @var string
     */
    public $serializer = QuestionSerializer::class;

    /**
     * @var QuestionRepository
     */
    protected $fields;

    /**
     * DeletePollController constructor.
     *
     * @param QuestionRepository $fields
     */
    public function __construct(QuestionRepository $fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param ServerRequestInterface $request
     */
    protected function delete(ServerRequestInterface $request)
    {
        $pollId = array_get($request->getQueryParams(), 'id');
        $poll = Question::find($pollId);

        $actor = $request->getAttribute('actor');

        if ($actor->can('edit.polls') || $actor->id === $poll->user_id) {
            return $this->fields->deletePoll($pollId);
        }
    }
}
