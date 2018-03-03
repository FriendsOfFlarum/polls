<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('polls') == false) {
            $schema->create('polls', function (Blueprint $table) {
                $table->increments('id');
                $table->string('question');
                $table->integer('discussion_id');
                $table->timestamps();
            });
        }

        if ($schema->hasTable('poll_options') == false) {
            $schema->create('poll_options', function (Blueprint $table) {
                $table->increments('id');
                $table->string('answer');
                $table->integer('poll_id')->unsigned();
                $table->foreign('poll_id')->references('id')->on('polls');
                $table->timestamps();
            });

        }

        if ($schema->hasTable('poll_votes') == false) {
            $schema->create('poll_votes', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('user_id')->unsigned();
                $table->integer('option_id')->unsigned();
                $table->timestamps();

                $table->foreign('option_id')->references('id')->on('poll_options');
                $table->foreign('user_id')->references('id')->on('users');
            });
        }
    },

    'down' => function (Builder $schema) {
        $schema->drop('polls');
        $schema->drop('poll_options');
        $schema->drop('poll_votes');
    }
];
