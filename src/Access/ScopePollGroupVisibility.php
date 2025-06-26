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
