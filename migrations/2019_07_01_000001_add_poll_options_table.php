<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use FoF\Polls\Migrations\AbstractMigration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return AbstractMigration::make(
    function (Builder $schema) {
        $schema->create('poll_options', function (Blueprint $table) {
            $table->increments('id');

            $table->string('answer');

            $table->integer('poll_id')->unsigned();

            $table->timestamps();

            $table->foreign('poll_id')->references('id')->on('polls')->onDelete('cascade');
        });
    },

    function (Builder $schema) {
        $schema->table('poll_options', function (Blueprint $table) {
            $table->dropForeign(['poll_id']);
        });

        $schema->table('poll_options', function (Blueprint $table) {
            $table->foreign('poll_id')->references('id')->on('polls')->onDelete('cascade');
        });
    },

    function (Builder $schema) {
        $schema->dropIfExists('poll_options');
    }
);
