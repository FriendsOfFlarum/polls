<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable('polls', function (Blueprint $table) {
    $table->increments('id');

    $table->string('question');

    $table->integer('discussion_id')->unsigned();
    $table->integer('user_id')->unsigned()->nullable();

    $table->boolean('public_poll');

    $table->timestamp('end_date')->nullable();
    $table->timestamps();

    $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
    $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
});
