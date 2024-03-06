<?php

namespace FoF\Polls\Api\Controllers;

use Flarum\Http\RequestUtil;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Polls\Poll;
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
    
    public function __construct(
        Factory $filesystemFactory,
        ImageManager $imageManager
    ) {
        $this->imageManager = $imageManager;
        $this->uploadDir = $filesystemFactory->disk('fof-polls');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $pollId = Arr::get($request->getQueryParams(), 'pollId');

        if ($actor->cannot('startPoll') || $actor->cannot('startGlobalPoll'))
        {
            throw new PermissionDeniedException('You do not have permission to upload poll images');
        }

        $file = Arr::get($request->getUploadedFiles(), $this->filenamePrefix);

        $encodedImage = $this->makeImage($file);

        $uploadName = $this->filenamePrefix.'-'.Str::lower(Str::random(8)).'.png';

        $this->uploadDir->put($uploadName, $encodedImage);

        if ($pollId && $poll = Poll::find($pollId)) {
            $poll->image = $uploadName;
            $poll->save();
        }

        return new JsonResponse([
            'fileUrl' => $this->uploadDir->url($uploadName),
            'fileName' => $uploadName,
        ]);
    }

    protected function makeImage(UploadedFileInterface $file): Image
    {
        $encodedImage = $this->imageManager->make($file->getStream()->getMetadata('uri'))->resize(250, 250, function (Constraint $constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        })->encode('png');

        return $encodedImage;
    }
}
