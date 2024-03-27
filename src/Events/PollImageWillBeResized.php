<?php

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
