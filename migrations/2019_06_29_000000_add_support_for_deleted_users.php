<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('poll_votes', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        $schema->table('poll_votes', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->nullable()->change();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    },

    'down' => function (Builder $schema) {
        // remain set null
    },
];
