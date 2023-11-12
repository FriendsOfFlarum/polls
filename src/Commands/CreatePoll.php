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
     * @var User
     */
    public $actor;

    /**
     * @var Post
     */
    public $post;

    /**
     * @var array
     */
    public $data;

    /**
     * @var callable
     */
    public $savePollOn;

    /**
     * @param User          $actor
     * @param Post          $post
     * @param array         $data
     * @param callable|null $savePollOn
     */
    public function __construct(User $actor, Post $post, array $data, callable $savePollOn = null)
    {
        $this->actor = $actor;
        $this->post = $post;
        $this->data = $data;
        $this->savePollOn = $savePollOn ?: function (callable $callback) {
            return $callback();
        };
    }
}
