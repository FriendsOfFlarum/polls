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

return [
    'up' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->dropForeign(['discussion_id']);
            $table->renameColumn('discussion_id', 'post_id');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->renameColumn('post_id', 'discussion_id');
            $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
        });
    }
];
