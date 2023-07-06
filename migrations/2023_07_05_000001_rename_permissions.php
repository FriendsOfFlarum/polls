<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $db->table('group_permission')
            ->where('permission', 'LIKE', '%discussion.polls')
            ->get()
            ->each(function ($row) use ($db) {
                $db->table('group_permission')
                    ->where('permission', $row->permission)
                    ->update(['permission' => str_replace('discussion.polls', 'discussion.polls.moderate', $row->permission)]);
            });

        $db->table('group_permission')
            ->where('permission', 'changeVotePolls')
            ->update(['permission' => 'polls.changeVote']);

        $db->table('group_permission')
            ->where('permission', 'selfEditPolls')
            ->update(['permission' => 'polls.selfEdit']);

        $db->table('group_permission')
            ->where('permission', 'startPolls')
            ->update(['permission' => 'discussion.polls.start']);

        $db->table('group_permission')
            ->where('permission', 'viewPollResultsWithoutVoting')
            ->update(['permission' => 'discussion.polls.viewResultsWithoutVoting']);

        $db->table('group_permission')
            ->where('permission', 'votePolls')
            ->update(['permission' => 'discussion.polls.vote']);
    },
    'down' => function (Builder $schema) {
        $schema->getConnection()->table('group_permission')
            ->where(function (\Illuminate\Database\Query\Builder $query) {
                // Tags will scope these permissions to the tag, so we need to use LIKE
                foreach (['moderate', 'start', 'viewResultsWithoutVoting', 'vote'] as $permission) {
                    $query->orWhere('permission', 'LIKE', "%discussion.polls.$permission");
                }

                foreach (['changeVote', 'selfEdit'] as $permission) {
                    $query->orWhere('permission', 'polls.'.$permission);
                }
            })
            ->delete();
    },
];
