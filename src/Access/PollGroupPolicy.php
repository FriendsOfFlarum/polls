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

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use FoF\Polls\PollGroup;

class PollGroupPolicy extends AbstractPolicy
{
    public function can(User $user, string $ability, PollGroup $pollGroup)
    {
        if ($ability === 'edit' || $ability === 'delete') {
            return $user->id === $pollGroup->user_id || $user->hasPermission('polls.moderate_group');
        }
    }

    public function create(User $user)
    {
        return $user->hasPermission('startPollGroup');
    }

    public function delete(User $user, PollGroup $pollGroup)
    {
        return $user->id === $pollGroup->user_id || $user->hasPermission('polls.moderate_group');
    }
}
