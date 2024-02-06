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
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ScopePollVisibility
{
    public function __invoke(User $actor, Builder $query)
    {
        //@todo review condition, check if comparison against user_id is required here if post_id is null
        $query->whereExists(function ($query) use ($actor) {
            $query->selectRaw('1')
                 ->from('posts')
                 ->whereColumn('posts.id', 'polls.post_id');
            Post::query()->setQuery($query)->whereVisibleTo($actor);
        })->orWhere('polls.post_id', null);
    }
}
