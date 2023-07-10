<?php

namespace FoF\Polls;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class PollRepository
{
    /**
     * @return Builder
     */
    public function query(): Builder
    {
        return Poll::query();
    }

    /**
     * @param User|null $user
     * @return Builder<Poll>
     */
    public function queryVisibleTo(?User $user = null): Builder {
        $query = $this->query();

        if ($user !== null) {
            $query->whereVisibleTo($user);
        }

        return $query;
    }

    /**
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($id, User $actor = null): Poll
    {
        return $this->queryVisibleTo($actor)->findOrFail($id);
    }
}
