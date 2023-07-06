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

return Migration::createTable('poll_votes', function (Blueprint $table) {
    $table->increments('id');

    $table->integer('poll_id')->unsigned();
    $table->integer('option_id')->unsigned();
    $table->integer('user_id')->unsigned()->nullable();

    $table->timestamps();

    $table->foreign('poll_id')->references('id')->on('polls')->onDelete('cascade');
    $table->foreign('option_id')->references('id')->on('poll_options')->onDelete('cascade');
    $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
});
