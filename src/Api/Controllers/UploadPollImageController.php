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
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Events\PollImageWillBeResized;
use FoF\Polls\Poll;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\Constraint;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use Psr\Http\Server\RequestHandlerInterface;

class UploadPollImageController implements RequestHandlerInterface
{
    protected $filenamePrefix = 'pollImage';

    /**
     * @var Cloud
     */
    protected $uploadDir;

    /**
     * @var ImageManager
     */
    protected $imageManager;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(
        Factory $filesystemFactory,
        ImageManager $imageManager,
        Dispatcher $events,
        SettingsRepositoryInterface $settings
    ) {
        $this->imageManager = $imageManager;
        $this->uploadDir = $filesystemFactory->disk('fof-polls');
        $this->events = $events;
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $pollId = Arr::get($request->getQueryParams(), 'pollId');

        if ($actor->cannot('startPoll') || $actor->cannot('startGlobalPoll')) {
            throw new PermissionDeniedException('You do not have permission to upload poll images');
        }

        $file = Arr::get($request->getUploadedFiles(), $this->filenamePrefix);

        $encodedImage = $this->makeImage($file);

        $uploadName = $this->uploadName();

        $this->uploadDir->put($uploadName, $encodedImage);

        if ($pollId && $poll = Poll::find($pollId)) {
            $poll->image = $uploadName;
            $poll->save();
        }

        return $this->jsonResponse($uploadName);
    }

    protected function makeImage(UploadedFileInterface $file): Image
    {
        $image = $this->imageManager->make($file->getStream()->getMetadata('uri'));

        $height = $this->settings->get('fof-polls.image_height');
        $width = $this->settings->get('fof-polls.image_width');

        $this->events->dispatch(new PollImageWillBeResized($image, $height, $width));
        
        $encodedImage = $this->resizeImage($image, $height, $width);

        return $encodedImage;
    }

    protected function resizeImage(Image $image, int $height = 250, int $width = 250, string $encoding = 'png'): Image
    {
        return $image->resize($height, $width, function (Constraint $constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        })->encode($encoding);
    }

    protected function uploadName(): string
    {
        return $this->filenamePrefix.'-'.Str::lower(Str::random(8)).'.png';
    }

    protected function jsonResponse(string $uploadName): JsonResponse
    {
        return new JsonResponse([
            'fileUrl'  => $this->uploadDir->url($uploadName),
            'fileName' => $uploadName,
        ]);
    }
}
