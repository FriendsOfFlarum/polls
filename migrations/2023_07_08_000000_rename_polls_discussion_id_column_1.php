<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

// Split 2/2 of 2023_07_08_000000_rename_polls_discussion_id_column.php
return [
    'up' => function (Builder $schema) {
        // Do not run this migration if the column was already renamed before the split
        if ($schema->hasColumn('polls', 'post_id')) {
            return;
        }

        $schema->table('polls', function (Blueprint $table) {
            $table->renameColumn('discussion_id', 'post_id');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->renameColumn('post_id', 'discussion_id');
        });
    },
];
