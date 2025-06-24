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
use FoF\Polls\Api\Serializers\PollGroupSerializer;
use FoF\Polls\PollGroupRepository;
use Illuminate\Database\Eloquent\Collection;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListPollGroupsController extends AbstractListController
{
    public $serializer = PollGroupSerializer::class;

    public $include = ['polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option'];

    public $optionalInclude = ['polls.votes', 'polls.votes.option', 'polls.votes.user'];

    /**
     * @var PollGroupRepository
     */
    protected $groups;

    /**
     * @var UrlGenerator
     */
    protected $url;

    public function __construct(PollGroupRepository $groups, UrlGenerator $url)
    {
        $this->groups = $groups;
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document): Collection
    {
        $actor = RequestUtil::getActor($request);
        $sort = $this->extractSort($request);
        $sortIsDefault = $this->sortIsDefault($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $include = $this->extractInclude($request);

        $results = $this->groups->queryVisibleTo($actor)
            ->orderBy($sortIsDefault ? 'id' : $sort, 'desc')
            ->skip($offset)
            ->take($limit);

        $totalItems = $results->count();
        $results = $results->get();

        $document->addPaginationLinks(
            $this->url->to('api')->route('fof.polls.groups.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $totalItems - ($offset + $limit) > 0 ? null : 0
        );

        $this->loadRelations($results, $include, $request);

        return $results;
    }
}
