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
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class DeletePollImageByNameController extends DeletePollImageController
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $fileName = Arr::get($request->getQueryParams(), 'fileName');

        if ($this->uploadDir->exists($fileName)) {
            $this->events->dispatch(
                new PollImageDeleting($fileName, $actor)
            );

            $this->uploadDir->delete($fileName);

            return new EmptyResponse(204);
        }

        throw new ModelNotFoundException();
    }
}
