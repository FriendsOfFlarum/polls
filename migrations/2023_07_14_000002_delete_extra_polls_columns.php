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

// These columns were superseded by the `settings` JSON column. Sites upgrading
// from 1.x may already have had them dropped, so both directions are guarded
// rather than using Migration::dropColumns(), whose up/down are unguarded.
$columns = [
    'public_poll'          => fn (Blueprint $table) => $table->boolean('public_poll')->default(false),
    'allow_multiple_votes' => fn (Blueprint $table) => $table->boolean('allow_multiple_votes')->default(false),
    'max_votes'            => fn (Blueprint $table) => $table->integer('max_votes')->unsigned()->default(0),
];

return [
    'up' => function (Builder $schema) use ($columns) {
        $existing = array_filter(
            array_keys($columns),
            fn (string $column) => $schema->hasColumn('polls', $column)
        );

        if ($existing !== []) {
            $schema->table('polls', function (Blueprint $table) use ($existing) {
                $table->dropColumn(array_values($existing));
            });
        }
    },
    'down' => function (Builder $schema) use ($columns) {
        foreach ($columns as $name => $definition) {
            if (! $schema->hasColumn('polls', $name)) {
                $schema->table('polls', function (Blueprint $table) use ($definition) {
                    $definition($table);
                });
            }
        }
    },
];
