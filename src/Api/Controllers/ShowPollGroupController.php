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

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use FoF\Polls\Api\Serializers\PollGroupSerializer;
use FoF\Polls\PollGroupRepository;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowPollGroupController extends AbstractShowController
{
    public $serializer = PollGroupSerializer::class;

    public $include = ['polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option'];

    public $optionalInclude = ['polls.votes', 'polls.votes.option', 'polls.votes.user'];

    public function __construct(protected PollGroupRepository $groups)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->groups->findOrFail(
            Arr::get($request->getQueryParams(), 'id'),
            RequestUtil::getActor($request)
        );
    }
}
