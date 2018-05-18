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
use Flarum\Core\Exception\PermissionDeniedException;
use Reflar\Polls\Answer;
use Reflar\Polls\Question;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\AnswerSerializer;
use Reflar\Polls\Repositories\AnswerRepository;

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
     *
     * @param AnswerRepository $fields
     */
    public function __construct(AnswerRepository $fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param ServerRequestInterface $request
     *
     * @throws PermissionDeniedException
     */
    protected function delete(ServerRequestInterface $request)
    {
        $actor = $request->getAttribute('actor');
        $answer = Answer::find(array_get($request->getQueryParams(), 'id'));

        if ($actor->can('edit.polls') || ($actor->id == Question::find($answer->poll_id)->user_id && $actor->can('selfEditPolls'))) {
            $this->fields->deleteAnswer($answer->id);
        } else {
            throw new PermissionDeniedException;
        }
    }
}
