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

use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use FoF\Polls\Events\PollImageDeleting;
use FoF\Polls\Poll;
use FoF\Polls\PollImageUploader;
use FoF\Polls\PollOption;
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

        // Keep this endpoint to a single, bare filename. Flysystem already
        // refuses to traverse outside the disk, but rejecting it here makes the
        // contract explicit and turns a malformed name into a 422 rather than
        // an unhandled filesystem error.
        if (!is_string($fileName) || $fileName === '' || basename($fileName) !== $fileName) {
            throw new ValidationException(['fileName' => 'The file name must be a single path segment.']);
        }

        // This endpoint exists so the client can clean up an image it just
        // uploaded for a poll that was never saved. If the name is already
        // attached to a poll or option, deleting it is an edit of that poll and
        // needs the same per-poll check the upload endpoint performs — image
        // filenames are public in poll payloads, so otherwise any user holding
        // `uploadPollImages` could delete another author's image.
        if ($poll = Poll::where('image', $fileName)->first()) {
            $actor->assertCan('edit', $poll);
        } elseif ($option = PollOption::where('image_url', $fileName)->first()) {
            $actor->assertCan('edit', $option->poll);
        }

        // Check if the base file exists (any variant implies it was uploaded)
        $basePath = $fileName;

        $this->events->dispatch(
            new PollImageDeleting($basePath, $actor)
        );

        $this->uploader->deleteAllVariants($basePath);

        return new EmptyResponse(204);
    }
}
