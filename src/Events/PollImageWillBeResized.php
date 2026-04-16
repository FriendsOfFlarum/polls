<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Events;

use Intervention\Image\Interfaces\ImageInterface;

class PollImageWillBeResized
{
    public function __construct(
        public ImageInterface $image,
        public string $fileName,
        public int $baseHeight,
        public int $baseWidth,
        public bool $isAnimated,
    ) {
    }
}
