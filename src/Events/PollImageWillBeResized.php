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

use Intervention\Image\Image;

class PollImageWillBeResized
{
    /**
     * @var Image
     */
    public $image;

    /**
     * @var int
     */
    public $height;

    /**
     * @var int
     */
    public $width;

    public function __construct(Image $image, int $height, int $width)
    {
        $this->image = $image;
        $this->height = $height;
        $this->width = $width;
    }
}
