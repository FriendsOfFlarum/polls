<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {

        $schema->table('polls', function (Blueprint $table) {
            $table->string('question')->nullable()->change();
        });

        $schema->table('poll_votes', function (Blueprint $table) {
            $table->integer('poll_id')->unsigned();
        });
    },

    'down' => function (Builder $schema) {
        $schema->drop('polls');
        $schema->drop('poll_votes');
    }
];
