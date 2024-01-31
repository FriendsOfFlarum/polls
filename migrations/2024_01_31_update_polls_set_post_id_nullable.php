<?php

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
