<?php

namespace Reflar\Polls\Api\Controllers;

use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Repositories\QuestionRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Flarum\Core\Post;

class DeletePollController extends AbstractCollectionController
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
        $actor = $request->getAttribute('actor');
        $post = Post::find($pollData['post']);

        if ($actor->can('edit.polls') || $actor->id == $post->user_id) {
            $this->fields->deletePoll(array_get($request->getQueryParams(), 'id'));
        }
    }
}
