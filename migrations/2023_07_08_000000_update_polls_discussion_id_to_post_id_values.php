<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Query\JoinClause;
use Illuminate\Database\Schema\Builder;

// Split 1/2 of 2023_07_08_000001_update_polls_discussion_relation_to_first_post.php
return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        if ($db->table('migrations')->where('migration', '2023_07_08_000001_update_polls_discussion_relation_to_first_post')->exists()) {
            return;
        }

        $db->transaction(function () use ($db) {
            $prefix = $db->getTablePrefix();

            // Don't run through this step if no rows exist in the polls table
            if (!$db->table('polls')->exists()) {
                return;
            }

            // Update polls whose discussions have a clear first post ID associated
            $db->table('polls')
                ->join('discussions', function (JoinClause $join) {
                    $join->on('polls.post_id', '=', 'discussions.id')
                        ->where('discussions.first_post_id', '!=', null);
                })
                ->update(['polls.post_id' => $db->raw("{$prefix}discussions.first_post_id")]);

            // Update polls whose discussions have a null first post ID associated
            $firstPosts = $db->table('posts')
                ->where('number', '=', 1);

            $db->table('polls')
                ->join('discussions', function (JoinClause $join) {
                    $join->on('polls.post_id', '=', 'discussions.id')
                        ->where('discussions.first_post_id', '=', null);
                })
                ->leftJoinSub($firstPosts, 'first_posts', function (JoinClause $join) {
                    $join->on('first_posts.discussion_id', '=', 'discussions.id');
                })
                ->update(['polls.post_id' => $db->raw("{$prefix}first_posts.id")]);

            // Delete polls that don't have an associated post
            $deletingPolls = $db->table('polls')
                ->where('post_id', 0);
            $count = $deletingPolls->count();

            if ($count > 0) {
                resolve('log')->warning("[fof/polls] deleting {$deletingPolls->count()} polls with no associated post");
                resolve('log')->warning("[fof/polls] |> #{$deletingPolls->pluck('id')->join(', #')}");
            } else {
                resolve('log')->info('[fof/polls] no polls to delete in v2 migration');
            }

            $deletingPolls->delete();
        });
    },
    'down' => function (Builder $schema) {
        $db = $schema->getConnection();

        $db->transaction(function () use ($db) {
            $prefix = $db->getTablePrefix();

            // Don't run through this step if no rows exist in the polls table
            if (!$db->table('polls')->exists()) {
                return;
            }

            // Go back to using discussion IDs. The discussion ID will always exist since the posts' foreign key cascades on delete.
            $db->table('polls')
                ->join('posts', 'polls.post_id', '=', 'posts.id')
                ->update(['polls.post_id' => $db->raw("{$prefix}posts.discussion_id")]);
        });
    },
];
