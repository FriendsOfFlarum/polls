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

namespace Reflar\Polls\Api\Controllers;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Question;
use Reflar\Polls\Repositories\QuestionRepository;
use Tobscure\JsonApi\Document;

class UpdateEndDateController extends AbstractShowController
{
    public $serializer = QuestionSerializer::class;

    /**
     * @var QuestionRepository
     */
    protected $fields;

    /**
     * UpdatePollController constructor.
     *
     * @param QuestionRepository $fields
     */
    public function __construct(QuestionRepository $fields)
    {
        $this->fields = $fields;
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
        $actor = $request->getAttribute('actor');
        $poll = Question::find(array_get($request->getQueryParams(), 'id'));

        if ($actor->can('edit.polls') || $actor->id === ($poll->user_id && $actor->can('selfEditPolls'))) {
            $endDate = new \DateTime($data['date']);

            if ($data['date'] === null) {
                $endDate = null;
            }
            $poll->end_date = $endDate;
            $poll->save();
        } else {
            throw new PermissionDeniedException();
        }
    }
}
