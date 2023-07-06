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

return Migration::createTable('poll_options', function (Blueprint $table) {
    $table->increments('id');

    $table->string('answer');

    $table->integer('poll_id')->unsigned();

    $table->timestamps();

    $table->foreign('poll_id')->references('id')->on('polls')->onDelete('cascade');
});
