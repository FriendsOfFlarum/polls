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

class DeletePollGroup
{
    public $actor;
    public $groupId;

    public function __construct(User $actor, int $groupId)
    {
        $this->actor = $actor;
        $this->groupId = $groupId;
    }
}
