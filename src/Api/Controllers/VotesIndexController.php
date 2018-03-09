<?php

namespace Treefiction\Polls\Api\Controllers;

use Treefiction\Polls\Api\Serializers\VoteSerializer;
use Treefiction\Polls\Repositories\VoteRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class VotesIndexController extends AbstractCollectionController
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
        $voteArray = array(
            'poll_id' => array_get($request->getQueryParams(), 'poll_id'),
            'user_id' => array_get($request->getQueryParams(), 'user_id')
        );

        return $this->fields->findVote($voteArray['poll_id'], $voteArray['user_id']);
    }
}
