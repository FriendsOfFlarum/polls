<?php

namespace FoF\Polls\Access;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;


class ScopePollGroupVisibility
{
    public function __invoke(User $actor, Builder $query)
    {
        if (!$actor->hasPermission('viewPollGroup')) {
            $query->whereRaw('1=0');
        }
    }
}