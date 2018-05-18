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

use Flarum\Api\Controller\AbstractResourceController;
use Flarum\Core\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Answer;
use Reflar\Polls\Api\Serializers\AnswerSerializer;
use Reflar\Polls\Question;
use Reflar\Polls\Validators\AnswerValidator;
use Tobscure\JsonApi\Document;

class UpdateAnswerController extends AbstractResourceController
{
    /**
     * @var string
     */
    public $serializer = AnswerSerializer::class;

    /**
     * @var AnswerValidator
     */
    protected $validator;

    /**
     * UpdateAnswerController constructor.
     *
     * @param AnswerValidator $validator
     */
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
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $data = $request->getParsedBody();
        $updatedAnswer = $data['answer'];
        $actor = $request->getAttribute('actor');
        $answer = Answer::find(array_get($request->getQueryParams(), 'id'));

        if ($actor->can('edit.polls') || ($actor->id === Question::find($answer->poll_id)->user_id && $actor->can('selfEditPolls'))) {
            $answer->answer = $updatedAnswer;
            $this->validator->assertValid(['answer' => $updatedAnswer]);
            $answer->save();

            return $answer;
        } else {
            throw new PermissionDeniedException;
        }
    }
}
