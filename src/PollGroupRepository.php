<?php

namespace FoF\Polls;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class PollGroupRepository
{
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