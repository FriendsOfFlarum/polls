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

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Core\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Answer;
use Reflar\Polls\Api\Serializers\AnswerSerializer;
use Reflar\Polls\Question;
use Reflar\Polls\Validators\AnswerValidator;
use Tobscure\JsonApi\Document;

class CreateAnswerController extends AbstractCreateController
{
    public $serializer = AnswerSerializer::class;

    /**
     * @var AnswerValidator
     */
    protected $validator;

    public function __construct(AnswerValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @throws PermissionDeniedException
     *
     * @return mixed|static
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $data = array_get($request->getParsedBody(), 'data.attributes', []);
        $poll = Question::find($data['poll_id']);
        $answer = Answer::build($data['answer']);

        if ($actor->can('edit.polls') || ($actor->id === $poll->user_id && $actor->can('selfEditPolls'))) {
            $this->validator->assertValid(['answer' => $data['answer']]);
            $poll->answers()->save($answer);

            return $answer;
        } else {
            throw new PermissionDeniedException;
        }
    }
}
