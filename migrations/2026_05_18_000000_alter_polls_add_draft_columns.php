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
        $schema->table('polls', function (Blueprint $table) {
            $table->timestamp('published_at')->nullable()->after('end_date');
            $table->timestamp('scheduled_publish_at')->nullable()->after('published_at');
            $table->text('scheduled_publish_error')->nullable()->after('scheduled_publish_at');
            $table->index('scheduled_publish_at', 'polls_scheduled_publish_at_index');
        });

        // Backfill: existing rows are considered published.
        $schema->getConnection()->table('polls')
            ->whereNull('published_at')
            ->update(['published_at' => $schema->getConnection()->raw('created_at')]);
    },
    'down' => function (Builder $schema) {
        $schema->table('polls', function (Blueprint $table) {
            $table->dropIndex('polls_scheduled_publish_at_index');
            $table->dropColumn(['published_at', 'scheduled_publish_at', 'scheduled_publish_error']);
        });
    },
];
