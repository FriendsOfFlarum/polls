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
use Flarum\Post\PostRepository;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Commands\CreatePoll;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
class CreatePollController extends AbstractCreateController
{
    public $serializer = PollSerializer::class;

    public $include = ['options'];

    public function __construct(protected PostRepository $posts, protected Dispatcher $bus)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $postId = Arr::get($request->getParsedBody(), 'data.relationships.post.data.id');
        $actor = RequestUtil::getActor($request);

        $post = null;

        if ($postId !== null) {
            $post = $this->posts->findOrFail($postId, $actor);
        }

        return $this->bus->dispatch(
            new CreatePoll(
                $actor,
                $post,
                Arr::get($request->getParsedBody(), 'data')
            )
        );
    }
}
