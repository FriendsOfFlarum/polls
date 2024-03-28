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
            $table->integer('post_id')->unsigned()->nullable()->change();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->integer('post_id')->unsigned()->nullable(false)->change();
        });
    },
];
