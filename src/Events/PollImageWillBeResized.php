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
     * @var string
     */
    public $fileName;
    
    /**
     * @var int
     */
    public $height;

    /**
     * @var int
     */
    public $width;

    public function __construct(Image $image, string $fileName, int $height, int $width)
    {
        $this->image = $image;
        $this->fileName = $fileName;
        $this->height = $height;
        $this->width = $width;
    }
}
