<?php

namespace Treefiction\Polls\Api\Controllers;

use Treefiction\Polls\Api\Serializers\QuestionSerializer;
use Treefiction\Polls\Repositories\QuestionRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Access\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class QuestionsIndexController extends AbstractCollectionController
{
    use AssertPermissionTrait;

    public $serializer = QuestionSerializer::class;

    public $include = [
        'answers',
        'votes'
    ];

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
        return $this->fields->all();
    }
}
