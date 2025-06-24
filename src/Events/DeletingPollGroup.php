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
use FoF\Polls\PollGroup;

class DeletingPollGroup
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var PollGroup
     */
    public $pollGroup;

    public function __construct(User $actor, PollGroup $pollGroup)
    {
        $this->actor = $actor;
        $this->pollGroup = $pollGroup;
    }
}
