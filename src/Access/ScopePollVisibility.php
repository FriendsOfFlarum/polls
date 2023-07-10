<?php

namespace FoF\Polls\Access;

use Flarum\Post\Post;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ScopePollVisibility
{
    public function __invoke(User $actor, Builder $query)
    {
        $query->whereExists(function ($query) use ($actor) {
           $query->selectRaw('1')
                ->from('posts')
                ->whereColumn('posts.id', 'polls.post_id');
           Post::query()->setQuery($query)->whereVisibleTo($actor);
        });
    }
}
