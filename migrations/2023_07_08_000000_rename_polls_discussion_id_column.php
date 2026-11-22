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

// Split 1/2 of 2023_07_08_000000_rename_polls_discussion_id_column.php
return [
    'up' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->dropForeign(['discussion_id']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
        });
    },
];
