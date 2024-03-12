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
use FoF\Polls\PollOption;

 class PollOptionCreated
 {
    /**
     * @var PollOption
     */
    public $option;

    /**
     * @var User
     */
    public $actor;
    
    public function __construct(PollOption $option, User $actor)
    {
        $this->option = $option;
        $this->actor = $actor;
    }
 }
