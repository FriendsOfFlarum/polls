<?php

namespace FoF\Polls\Events;

use Flarum\User\User;

class PollImageDeleting
{
    /**
     * @var string
     */
    public $fileName;

    /**
     * @var User
     */
    public $actor;

    public function __construct(string $fileName, User $actor)
    {
        $this->fileName = $fileName;
        $this->actor = $actor;
    }
}
