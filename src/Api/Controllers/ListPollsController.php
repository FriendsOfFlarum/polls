<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Poll;
use Illuminate\Database\Eloquent\Collection;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListPollsController extends AbstractListController
{
    public $serializer = PollSerializer::class;

    public $include = [
        'options',
        'votes',
        'myVotes',
        'myVotes.option',
    ];

    /**
     * @var UrlGenerator
     */
    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    public function data(ServerRequestInterface $request, Document $document): Collection
    {
        $actor = RequestUtil::getActor($request);

        // Not yet needed, but here if/when we do.
        // $filters = $this->extractFilter($request);
        // $sort = $this->extractSort($request);
        // $sortIsDefault = $this->sortIsDefault($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $include = $this->extractInclude($request);

        $results = Poll::query()
            ->select('polls.*')
            ->whereVisibleTo($actor)
            ->orderBy('id')
            ->skip($offset)
            ->take($limit);

        $totalItems = $results->count();
        $results = $results->get();

        $document->addPaginationLinks(
            $this->url->to('api')->route('fof.polls.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $totalItems - ($offset + $limit) > 0 ? null : 0
        );

        $this->loadRelations($results, $include, $request);

        return $results;
    }
}
