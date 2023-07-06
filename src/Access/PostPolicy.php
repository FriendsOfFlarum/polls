<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Access;

use Flarum\Post\Post;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class PostPolicy extends AbstractPolicy
{
    public function startPoll(User $actor, Post $post)
    {
        if ($actor->can('edit', $post) && $actor->can('polls.start', $post->discussion)) {
            return $this->allow();
        }
    }
}
