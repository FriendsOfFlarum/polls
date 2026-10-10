<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api;

/**
 * What to eager load with included polls, for every endpoint that includes
 * them, so a list costs the same with one poll as with fifty.
 *
 * The include buffer resolves each poll's relationships before it queues the
 * next poll, so it would query these once per poll. The poll policies also
 * read the viewer's votes while a poll's attributes are serialized, before
 * the buffer runs at all, so myVotes is loaded with the polls themselves.
 *
 * Core applies each related resource's scope to these eager loads too, and the
 * serializer still checks each field's visibility, so they expose nothing the
 * buffer would not. A poll's post and poll group are not listed because they
 * do not grow: the post is the one the polls were loaded through (see
 * Post::polls), and the buffer batches the group.
 *
 * The cost: an eager load cannot see the `votes` field's visibility, so when
 * a client includes votes below polls (`polls.votes`, or `votes.option` and
 * `votes.user` on the poll list), the votes of polls whose voters are hidden
 * are loaded too and then left out of the response. That is one query, only
 * for that include. `votes` alone on the poll list is left to the buffer,
 * which batches that level and skips hidden polls, so the poll directory's
 * default request loads no votes it does not show.
 */
class PollEagerLoads
{
    private const NESTED = ['options', 'votes', 'votes.option', 'votes.user', 'myVotes.option', 'myVotes.user', 'user'];

    /**
     * For polls included at $path ('polls', 'firstPost.polls').
     *
     * @return array<string, string[]> include => relations, for eagerLoadWhenIncluded()
     */
    public static function under(string $path): array
    {
        $map = [$path => [$path.'.myVotes']];

        foreach (self::NESTED as $relation) {
            $map[$path.'.'.$relation] = [$path.'.'.$relation];
        }

        return $map;
    }

    /**
     * For an endpoint whose primary resources are the polls.
     *
     * @return array<string, string[]>
     */
    public static function primary(): array
    {
        $map = [];

        foreach (array_diff(self::NESTED, ['votes']) as $relation) {
            $map[$relation] = [$relation];
        }

        return $map;
    }
}
