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
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\PollOption;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UploadPollOptionImageController extends UploadPollImageController
{
    protected $filenamePrefix = 'pollOptionImage';

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $optionId = Arr::get($request->getQueryParams(), 'optionId');

        $areUploadsAllowed = (bool) $this->settings->get('fof-polls.allowImageUploads');

        if (!$areUploadsAllowed) {
            throw new PermissionDeniedException();
        }

        $actor->assertCan('uploadPollImages');

        // if an option ID is given, check that the user can edit that poll (and thus upload images!)
        if ($optionId) {
            $option = PollOption::findOrFail($optionId);
            $poll = $option->poll;

            $actor->assertCan('edit', $poll);
        } else {
            $option = null;

            // we don't know whether this image is for a global or a regular poll -- image upload can be done before poll creation
            $actor->assertCan('startPoll');
            $actor->assertCan('startGlobalPoll');
        }

        $file = Arr::get($request->getUploadedFiles(), $this->filenamePrefix);

        $uploadName = $this->uploadName();

        $encodedImage = $this->makeImage($file, $uploadName);

        $this->uploadDir->put($uploadName, $encodedImage);

        if ($option) {
            $option->image_url = $uploadName;
            $option->save();
        }

        return $this->jsonResponse($uploadName);
    }
}
