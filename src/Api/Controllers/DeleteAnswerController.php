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
use Reflar\Polls\Answer;
use Reflar\Polls\Repositories\AnswerRepository;
use Reflar\Polls\Api\Serializers\AnswerSerializer;

class DeleteAnswerController extends AbstractDeleteController
{
    /**
     * @var string
     */
    public $serializer = AnswerSerializer::class;

    /**
     * @var AnswerRepository
     */
    protected $fields;

    /**
     * UpdatePollController constructor.
     * @param AnswerRepository $fields
     */
    public function __construct(AnswerRepository $fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param ServerRequestInterface $request
     * @return mixed
     */
    protected function delete(ServerRequestInterface $request)
    {
        $answer = Answer::find(array_get($request->getQueryParams(), 'id'));

        $actor = $request->getAttribute('actor');

        if ($actor->can('edit.polls') || $actor->id === $answer->poll()->user_id) {
            return $this->fields->deleteAnswer(array_get($request->getQueryParams(), 'id'));
        }
    }
}
