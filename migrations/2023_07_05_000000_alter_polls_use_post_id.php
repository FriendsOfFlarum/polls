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
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $schema->table('polls', function (Blueprint $table) {
            $table->dropForeign(['discussion_id']);
        });

        $db->transaction(function () use ($db) {
            // Don't run through this step if no rows exist in the polls table
            if (!$db->table('polls')->exists()) {
                return;
            }

            // Update polls whose discussions have a clear first post ID associated
            $db->table('polls')
                ->join('discussions', function (JoinClause $join) {
                    $join->on('polls.discussion_id', '=', 'discussions.id')
                        ->where('discussions.first_post_id', '!=', null);
                })
                ->update(['polls.discussion_id' => $db->raw('discussions.first_post_id')]);


            // Update polls whose discussions have a null first post ID associated
            $firstPosts = $db->table('posts')
                ->where('number', '=', 1);

            $db->table('polls')
                ->join('discussions', function (JoinClause $join) {
                    $join->on('polls.discussion_id', '=', 'discussions.id')
                        ->where('discussions.first_post_id', '=', null);
                })
                ->leftJoinSub($firstPosts, 'first_posts', function (JoinClause $join) {
                    $join->on('first_posts.discussion_id', '=', 'discussions.id');
                })
                ->update(['polls.discussion_id' => $db->raw('first_posts.id')]);

            // Delete polls that don't have an associated post
            // TODO Is this a good idea? Not sure what situations can result in first_post_id being null but the discussion still existing with an associated first post.
            $db->table('polls')
                ->where('discussion_id', 0)
                ->delete();
        });

        $schema->table('polls', function (Blueprint $table) {
            $table->renameColumn('discussion_id', 'post_id');
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        // TODO is a down migration needed for this?
    },
];
