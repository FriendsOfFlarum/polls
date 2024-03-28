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
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DeletePollImageController implements RequestHandlerInterface
{
    /**
     * @var Cloud
     */
    protected $uploadDir;

    /**
     * @var Dispatcher
     */
    protected $events;

    public function __construct(Factory $filesystemFactory, Dispatcher $events)
    {
        $this->uploadDir = $filesystemFactory->disk('fof-polls');
        $this->events = $events;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $pollId = Arr::get($request->getQueryParams(), 'pollId');

        /** @var Poll $poll */
        $poll = Poll::find($pollId);

        $this->events->dispatch(
            new PollImageDeleting($poll->image, $actor)
        );

        $this->uploadDir->delete($poll->image);

        $poll->image = null;
        $poll->save();

        return new EmptyResponse(204);
    }
}
