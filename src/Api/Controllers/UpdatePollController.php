<?php

namespace Reflar\Polls\Api\Controllers;

use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Repositories\QuestionRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
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

        // $this->assertAdmin($request->getAttribute('actor'));
        $actor = $request->getAttribute('actor');
        // $this->assertCan($actor, 'editPoll', $user);

var_dump($actor->isAdmin());
        // return $this->fields->editPoll(array_get($request->getQueryParams(), 'id'), $pollData);
    }
}
