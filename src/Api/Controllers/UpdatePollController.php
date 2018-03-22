<?php

namespace Treefiction\Polls\Api\Controllers;

use Treefiction\Polls\Api\Serializers\QuestionSerializer;
use Treefiction\Polls\Repositories\QuestionRepository;
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

        return $this->fields->editPoll(array_get($request->getQueryParams(), 'id'), $pollData);
    }
}
