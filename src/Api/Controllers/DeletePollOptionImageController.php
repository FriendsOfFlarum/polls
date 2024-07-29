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
use FoF\Polls\PollOption;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DeletePollOptionImageController implements RequestHandlerInterface
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
        $optionId = Arr::get($request->getQueryParams(), 'optionId');

        /** @var PollOption $option */
        $option = PollOption::find($optionId);

        $actor->assertCan('edit', $option->poll);

        // if the image_url is a fully qualified URL, we just set it to null
        if (filter_var($option->image_url, FILTER_VALIDATE_URL)) {
        } else {
            $this->events->dispatch(
                new PollImageDeleting($option->image_url, $actor)
            );

            // otherwise we check and delete it from the filesystem
            $this->uploadDir->delete($option->image_url);
        }

        $option->image_url = null;
        $option->save();

        return new EmptyResponse(204);
    }
}
