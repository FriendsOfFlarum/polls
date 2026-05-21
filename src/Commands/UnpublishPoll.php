<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use Flarum\User\User;

class UnpublishPoll
{
    /**
     * @var int
     */
    public $pollId;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var array
     */
    public $data;

    /**
     * @param int   $pollId
     * @param User  $actor
     * @param array $data
     */
    public function __construct(int $pollId, User $actor, array $data)
    {
        $this->pollId = $pollId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
