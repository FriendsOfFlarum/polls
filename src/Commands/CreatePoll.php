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

use Flarum\Post\Post;
use Flarum\User\User;

class CreatePoll
{
    /**
     * @var callable
     */
    public $savePollOn;

    public function __construct(public User $actor, public ?Post $post, public array $data, ?callable $savePollOn = null)
    {
        $this->savePollOn = $savePollOn ?: function (callable $callback) {
            return $callback();
        };
    }
}
