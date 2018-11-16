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

use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\VoteSerializer;
use Reflar\Polls\Repositories\VoteRepository;
use Tobscure\JsonApi\Document;

class ListVotesController extends AbstractListController
{
    public $serializer = VoteSerializer::class;

    /**
     * @var VoteRepository
     */
    protected $fields;

    /**
     * ListVotesController constructor.
     *
     * @param VoteRepository $fields
     */
    public function __construct(VoteRepository $fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $voteArray = [
            'poll_id' => array_get($request->getQueryParams(), 'poll_id'),
            'user_id' => array_get($request->getQueryParams(), 'user_id'),
        ];

        return $this->fields->findVote($voteArray['poll_id'], $voteArray['user_id']);
    }
}
