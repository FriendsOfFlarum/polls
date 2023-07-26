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
use Illuminate\Support\Arr;

// Split 2/2 of 2023_07_08_000001_update_polls_discussion_relation_to_first_post.php
return [
    'up' => function (Builder $schema) {
        // Do not run this migration if the foreign key was already added before the split
        $db = $schema->getConnection();
        $foreignKeys = $db->getDoctrineSchemaManager()->listTableForeignKeys("{$db->getTablePrefix()}polls");

        foreach ($foreignKeys as $foreignKey) {
            if (in_array('post_id', $foreignKey->getLocalColumns())) {
                return;
            }
        }

        $schema->table('polls', function (Blueprint $table) {
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
        });
    },
];
