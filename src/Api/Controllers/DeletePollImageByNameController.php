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
use FoF\Polls\PollImageUploader;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DeletePollImageByNameController implements RequestHandlerInterface
{
    public function __construct(
        protected PollImageUploader $uploader,
        protected Dispatcher $events,
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $fileName = Arr::get($request->getQueryParams(), 'fileName');

        $actor->assertCan('uploadPollImages');

        // Check if the base file exists (any variant implies it was uploaded)
        $basePath = $fileName;

        $this->events->dispatch(
            new PollImageDeleting($basePath, $actor)
        );

        $this->uploader->deleteAllVariants($basePath);

        return new EmptyResponse(204);
    }
}
