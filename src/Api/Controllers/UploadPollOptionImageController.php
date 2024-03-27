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

        if ($actor->cannot('startPoll') || $actor->cannot('startGlobalPoll')) {
            throw new PermissionDeniedException('You do not have permission to upload poll option images');
        }

        $file = Arr::get($request->getUploadedFiles(), $this->filenamePrefix);

        $encodedImage = $this->makeImage($file);

        $uploadName = $uploadName = $this->uploadName();

        $this->uploadDir->put($uploadName, $encodedImage);

        if ($optionId && $option = PollOption::find($optionId)) {
            $option->image_url = $uploadName;
            $option->save();
        }

        return $this->jsonResponse($uploadName);
    }
}
