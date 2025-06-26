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
use FoF\Polls\PollGroup;
use Illuminate\Database\Eloquent\Builder;

class ScopePollVisibility
{
    public function __invoke(User $actor, Builder $query)
    {
        $query->where(function ($query) use ($actor) {
            $query->whereExists(function ($query) use ($actor) {
                $query->selectRaw('1')
                    ->from('posts')
                    ->whereColumn('posts.id', 'polls.post_id');
                Post::query()->setQuery($query)->whereVisibleTo($actor);
            });
            $query->orWhere('polls.post_id', null);
        })->where(function ($query) use ($actor) {
            $query->whereExists(function ($query) use ($actor) {
                $query->selectRaw('1')
                    ->from('poll_groups')
                    ->whereColumn('poll_groups.id', 'polls.poll_group_id');
                PollGroup::query()->setQuery($query)->whereVisibleTo($actor);
            });
            $query->orWhere('polls.poll_group_id', null);
        });
    }
}
