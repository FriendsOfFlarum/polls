<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Audit;

use FoF\Polls\Events\PollVotesChanged;
use FoF\Polls\Poll;
use FoF\Polls\PollGroup;
use Illuminate\Support\Collection;

/**
 * What flarum/audit stores for each poll action (see extend.php).
 */
class Payloads
{
    /**
     * A poll in a discussion carries its discussion and post, so the audit
     * browser can filter by discussion.
     */
    public static function poll(Poll $poll): array
    {
        $payload = ['poll_id' => $poll->id, 'title' => $poll->question];

        if ($poll->post_id !== null) {
            $payload['discussion_id'] = $poll->post?->discussion_id;
            $payload['post_id'] = $poll->post_id;
        }

        return $payload;
    }

    /**
     * Null (nothing logged) when the vote changed nothing. The choice is only
     * recorded for public polls: a private poll's voters are hidden, so the
     * log keeps that.
     */
    public static function vote(PollVotesChanged $event): ?array
    {
        if ($event->votedOptionIds->isEmpty() && $event->unvotedOptionIds->isEmpty()) {
            return null;
        }

        $payload = self::poll($event->poll);

        if ($event->poll->public_poll) {
            $payload['added_option_ids'] = self::ids($event->votedOptionIds);
            $payload['removed_option_ids'] = self::ids($event->unvotedOptionIds);
        }

        return $payload;
    }

    public static function pollGroup(PollGroup $group): array
    {
        return ['poll_group_id' => $group->id, 'name' => $group->name];
    }

    /**
     * @return int[]
     */
    private static function ids(Collection $ids): array
    {
        return $ids->map(fn ($id) => (int) $id)->values()->all();
    }
}
