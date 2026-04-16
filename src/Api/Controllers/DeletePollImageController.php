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

use Flarum\Http\RequestUtil;
use FoF\Polls\Events\PollImageDeleting;
use FoF\Polls\Poll;
use FoF\Polls\PollImageUploader;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DeletePollImageController implements RequestHandlerInterface
{
    public function __construct(
        protected PollImageUploader $uploader,
        protected Dispatcher $events,
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $pollId = Arr::get($request->getQueryParams(), 'pollId');

        /** @var Poll $poll */
        $poll = Poll::find($pollId);

        $actor->assertCan('uploadPollImages');

        $this->events->dispatch(
            new PollImageDeleting($poll->image, $actor)
        );

        if ($poll->image && ! filter_var($poll->image, FILTER_VALIDATE_URL)) {
            $this->uploader->deleteAllVariants($poll->image);
        }

        $poll->image = null;
        $poll->save();

        return new EmptyResponse(204);
    }
}
