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

use FoF\Polls\PollOption;
use Intervention\Image\Constraint;
use Intervention\Image\Image;
use Psr\Http\Message\UploadedFileInterface;

class UploadPollOptionImageController extends UploadPollImageController
{
    protected $filenamePrefix = 'pollImageOption';

    protected function createLocalPath(string $filename, ?string $pollId): string
    {
        if (!$pollId) {
            throw new \InvalidArgumentException('Poll ID is required');
        }

        return "pollOptions/{$pollId}/{$filename}";
    }

    protected function linkToRecord(int $pollId, string $uploadName): void
    {
        if ($pollId && $pollOption = PollOption::find($pollId)) {
            $pollOption->image = $uploadName;
            $pollOption->save();
        }
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
