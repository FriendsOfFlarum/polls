<?php

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
