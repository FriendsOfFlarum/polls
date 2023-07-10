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

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Bus\Dispatcher;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Commands\CreatePoll;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreatePollController extends AbstractCreateController
{
    public $serializer = PollSerializer::class;

    public $include = ['options'];

    /**
     * @var Dispatcher
     */
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $postId = Arr::get($request->getParsedBody(), 'data.relationships.post.data.id');

        return $this->bus->dispatch(
            new CreatePoll(
                RequestUtil::getActor($request),
                $postId,
                Arr::get($request->getParsedBody(), 'data.attributes')
            )
        );
    }
}
