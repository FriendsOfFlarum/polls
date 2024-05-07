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
