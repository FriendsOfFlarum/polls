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
use FoF\Polls\PollOption;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DeletePollOptionImageController implements RequestHandlerInterface
{
    public function __construct(
        protected PollImageUploader $uploader,
        protected Dispatcher $events,
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $optionId = Arr::get($request->getQueryParams(), 'optionId');

        /** @var PollOption $option */
        $option = PollOption::findOrFail($optionId);

        $actor->assertCan('uploadPollImages');
        // Same per-poll check the option upload endpoint already performs —
        // otherwise `uploadPollImages` alone was enough to clear the image of
        // any option on any poll.
        $actor->assertCan('edit', $option->poll);

        if ($option->image_url) {
            /**
             * @deprecated External URL images are deprecated. In a future version,
             * only uploaded images will be supported.
             */
            if (filter_var($option->image_url, FILTER_VALIDATE_URL)) {
                // External URL — just clear the field, no file to delete.
            } else {
                $this->events->dispatch(
                    new PollImageDeleting($option->image_url, $actor)
                );

                $this->uploader->deleteAllVariants($option->image_url);
            }
        }

        $option->image_url = null;
        $option->save();

        return new EmptyResponse(204);
    }
}
