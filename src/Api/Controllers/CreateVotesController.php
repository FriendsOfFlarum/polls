<?php

namespace Treefiction\Polls\Api\Controllers;

use Treefiction\Polls\Api\Serializers\VoteSerializer;
use Treefiction\Polls\Repositories\VoteRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Support\Arr;

class VotesStoreController extends AbstractCollectionController
{
    public $serializer = VoteSerializer::class;

    /**
     * @var VoteRepository
     */
    protected $fields;

    public function __construct(VoteRepository $fields)
    {
        $this->fields = $fields;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->fields->store($attributes);
    }
}
