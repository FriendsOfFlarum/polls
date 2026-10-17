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
 * buffer would not. A poll's post is not listed: below a post it is the one
 * the polls were loaded through (see Post::polls). A poll group's discussion
 * polls arrive without theirs, so the group endpoints load it (see inGroups()).
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
    /**
     * include => the relations it needs loaded. Each user path brings the
     * user's groups along: serializing a user for an actor who can edit
     * credentials reads them (UserPolicy::editCredentials asks isAdmin()), as
     * does an explicit `user.groups` include, so polls with different authors
     * or voters would otherwise load them one user at a time.
     */
    private const NESTED = [
        'options'        => ['options'],
        'votes'          => ['votes'],
        'votes.option'   => ['votes.option'],
        'votes.user'     => ['votes.user', 'votes.user.groups'],
        'myVotes.option' => ['myVotes.option'],
        'myVotes.user'   => ['myVotes.user', 'myVotes.user.groups'],
        'user'           => ['user', 'user.groups'],
        'pollGroup'      => ['pollGroup'],
    ];

    /**
     * For polls included at $path ('polls', 'firstPost.polls').
     *
     * @return array<string, string[]> include => relations, for eagerLoadWhenIncluded()
     */
    public static function under(string $path): array
    {
        $map = [$path => [$path.'.myVotes']];

        foreach (self::NESTED as $include => $relations) {
            $map[$path.'.'.$include] = array_map(fn (string $relation) => $path.'.'.$relation, $relations);
        }

        return $map;
    }

    /**
     * For a poll group's polls. A group can hold discussion polls, and the
     * poll policies read each one's post and discussion, and the actor's
     * state in that discussion, as core loads with its posts. With flarum/tags,
     * extend.php adds the discussion's tags.
     *
     * @return array<string, string[]>
     */
    public static function inGroups(): array
    {
        $map = self::under('polls');
        $map['polls'] = [...$map['polls'], 'polls.post', 'polls.post.discussion', 'polls.post.discussion.state'];

        return $map;
    }

    /**
     * For an endpoint whose primary resources are the polls.
     *
     * @return array<string, string[]>
     */
    public static function primary(): array
    {
        $map = self::NESTED;
        unset($map['votes']);

        return $map;
    }
}
