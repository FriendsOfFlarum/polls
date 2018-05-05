<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('poll_votes', function (Blueprint $table) use ($schema) {
            if (!$schema->hasColumn('poll_votes', 'poll_id')) {
                $table->integer('poll_id')->unsigned();
            }
        });
    },
];
