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

use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Post;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Repositories\QuestionRepository;
use Tobscure\JsonApi\Document;

class UpdatePollController extends AbstractCollectionController
{
    public $serializer = QuestionSerializer::class;

    /**
     * @var QuestionRepository
     */
    protected $fields;

    public function __construct(QuestionRepository $fields)
    {
        $this->fields = $fields;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $pollData = $request->getParsedBody()['pollArray'];
        $actor = $request->getAttribute('actor');

        $post = Post::find($pollData['post']);

        if ($actor->can('edit.polls') || $actor->id == $post->user_id) {
            return $this->fields->editPoll(array_get($request->getQueryParams(), 'id'), $pollData);
        }
    }
}
