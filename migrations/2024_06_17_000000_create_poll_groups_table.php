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
        $schema->create('poll_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('name');
            $table->integer('user_id')->unsigned()->nullable();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });

        // Add poll_group_id to polls table
        $schema->table('polls', function (Blueprint $table) {
            $table->integer('poll_group_id')->unsigned()->nullable();
            $table->foreign('poll_group_id')->references('id')->on('poll_groups')->nullOnDelete();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->dropForeign(['poll_group_id']);
            $table->dropColumn('poll_group_id');
        });
        $schema->dropIfExists('poll_groups');
    },
];
