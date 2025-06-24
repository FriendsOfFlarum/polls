<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class PollGroupRepository
{
    public static function createPollGroup(User $actor, string $name): PollGroup
    {
        $pollGroup = new PollGroup();
        $pollGroup->user_id = $actor->id;
        $pollGroup->name = $name;

        return $pollGroup;
    }

    /**
     * @return Builder
     */
    public function query(): Builder
    {
        return PollGroup::query();
    }

    /**
     * @param User|null $user
     *
     * @return Builder<PollGroup>
     */
    public function queryVisibleTo(?User $user = null): Builder
    {
        $query = $this->query();

        if ($user !== null) {
            $query->whereVisibleTo($user);
        }

        return $query;
    }

    /**
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($id, ?User $actor = null): PollGroup
    {
        return $this->queryVisibleTo($actor)->findOrFail($id);
    }

    public function find($id, ?User $actor = null): ?PollGroup
    {
        return $this->queryVisibleTo($actor)->find($id);
    }
}
