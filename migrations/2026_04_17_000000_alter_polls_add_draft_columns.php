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

return [
    'up' => function (Builder $schema) {
        // This migration was released on 1.x under this same filename, so sites
        // upgrading from 1.x may already have these columns. Each step is
        // guarded to keep the migration safe to re-run against any state.
        $columns = [
            'published_at'            => fn (Blueprint $table, string $after) => $table->timestamp('published_at')->nullable()->after($after),
            'scheduled_publish_at'    => fn (Blueprint $table, string $after) => $table->timestamp('scheduled_publish_at')->nullable()->after($after),
            'scheduled_publish_error' => fn (Blueprint $table, string $after) => $table->text('scheduled_publish_error')->nullable()->after($after),
        ];

        $after = 'end_date';

        foreach ($columns as $name => $definition) {
            if (! $schema->hasColumn('polls', $name)) {
                $schema->table('polls', function (Blueprint $table) use ($definition, $after) {
                    $definition($table, $after);
                });
            }

            $after = $name;
        }

        if (! $schema->hasIndex('polls', 'polls_scheduled_publish_at_index')) {
            $schema->table('polls', function (Blueprint $table) {
                $table->index('scheduled_publish_at', 'polls_scheduled_publish_at_index');
            });
        }

        // Backfill: existing rows are considered published.
        $schema->getConnection()->table('polls')
            ->whereNull('published_at')
            ->update(['published_at' => $schema->getConnection()->raw('created_at')]);
    },
    'down' => function (Builder $schema) {
        if ($schema->hasIndex('polls', 'polls_scheduled_publish_at_index')) {
            $schema->table('polls', function (Blueprint $table) {
                $table->dropIndex('polls_scheduled_publish_at_index');
            });
        }

        $existing = array_filter(
            ['published_at', 'scheduled_publish_at', 'scheduled_publish_error'],
            fn (string $column) => $schema->hasColumn('polls', $column)
        );

        if ($existing !== []) {
            $schema->table('polls', function (Blueprint $table) use ($existing) {
                $table->dropColumn(array_values($existing));
            });
        }
    },
];
