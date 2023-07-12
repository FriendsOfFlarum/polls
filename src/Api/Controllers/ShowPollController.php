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
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\PollRepository;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowPollController extends AbstractShowController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = PollSerializer::class;

    public $include = ['options', 'myVotes', 'myVotes.option'];

    public $optionalInclude = ['votes', 'votes.option', 'votes.user'];

    /**
     * @var PollRepository
     */
    protected $polls;

    public function __construct(PollRepository $polls)
    {
        $this->polls = $polls;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->polls->findOrFail(
            Arr::get($request->getQueryParams(), 'id'),
            RequestUtil::getActor($request)
        );
    }
}
