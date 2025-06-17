<?php

namespace FoF\Polls\Access;

use FoF\Polls\PollGroup;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

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