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
    public function __invoke(User $actor, Builder $query): void
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
        })->where(function ($query) use ($actor) {
            // Published polls + all discussion-scoped polls pass.
            $query->whereNotNull('polls.published_at')
                ->orWhereNotNull('polls.post_id');

            // Author sees their own drafts.
            if ($actor->exists) {
                $query->orWhere('polls.user_id', $actor->id);
            }

            // Moderators see all drafts. We use the global `hasPermission`
            // check (not the per-discussion `can(...)` used in
            // PollPolicy::edit) because drafts are global-only by
            // definition — `Poll::isDraft()` requires `isGlobal()`, so no
            // poll has a parent discussion whose tags would scope the
            // permission. If isDraft() is ever loosened to discussion-bound
            // polls, this check needs to become per-discussion to honour
            // tag-scoped polls.moderate restrictions.
            if ($actor->hasPermission('polls.moderate')) {
                $query->orWhereNull('polls.published_at');
            }
        });
    }
}
