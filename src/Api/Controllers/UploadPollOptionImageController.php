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
use FoF\Polls\Events\PollImageWillBeResized;
use FoF\Polls\PollOption;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UploadPollOptionImageController extends UploadPollImageController
{
    protected string $filenamePrefix = 'pollOptionImage';

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $optionId = Arr::get($request->getQueryParams(), 'optionId');

        $actor->assertCan('uploadPollImages');

        if ($optionId) {
            $option = PollOption::findOrFail($optionId);
            $poll = $option->poll;
            $actor->assertCan('edit', $poll);
        } else {
            $option = null;

            // No option to authorize against yet — see
            // UploadPollImageController::assertCanStartAnyPoll().
            $this->assertCanStartAnyPoll($actor);
        }

        $file = Arr::get($request->getUploadedFiles(), $this->filenamePrefix);

        $this->validator->assertValid([$this->filenamePrefix => $file]);

        $image = $this->imageManager->read($file->getStream()->getMetadata('uri'));

        $baseWidth = (int) ($this->settings->get('fof-polls.image_width') ?: 250);
        $baseHeight = (int) ($this->settings->get('fof-polls.image_height') ?: 250);

        $this->events->dispatch(new PollImageWillBeResized(
            $image,
            $this->filenamePrefix,
            $baseHeight,
            $baseWidth,
            $image->isAnimated(),
        ));

        $uploadName = $this->uploader->upload($this->filenamePrefix, $image);

        if ($option) {
            // Delete old image variants if replacing
            if ($option->image_url && !filter_var($option->image_url, FILTER_VALIDATE_URL)) {
                $this->uploader->deleteAllVariants($option->image_url);
            }

            $option->image_url = $uploadName;
            $option->save();
        }

        return new JsonResponse([
            'fileUrl'  => $this->uploader->url($uploadName),
            'fileName' => $uploadName,
        ]);
    }
}
