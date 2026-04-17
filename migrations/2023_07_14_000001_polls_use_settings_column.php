<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        // Migrate individual columns into the JSON settings column.
        // Uses PHP to build JSON since JSON_OBJECT() is MySQL-specific.
        foreach ($db->table('polls')->select(['id', 'public_poll', 'allow_multiple_votes', 'max_votes'])->cursor() as $poll) {
            $db->table('polls')
                ->where('id', $poll->id)
                ->update([
                    'settings' => json_encode([
                        'public_poll'          => (bool) $poll->public_poll,
                        'allow_multiple_votes' => (bool) $poll->allow_multiple_votes,
                        'max_votes'            => (int) $poll->max_votes,
                    ]),
                ]);
        }
    },
    'down' => function (Builder $schema) {
        $db = $schema->getConnection();

        foreach ($db->table('polls')->select(['id', 'settings'])->cursor() as $poll) {
            $settings = json_decode($poll->settings, true) ?? [];

            $db->table('polls')
                ->where('id', $poll->id)
                ->update([
                    'public_poll'          => (bool) ($settings['public_poll'] ?? false),
                    'allow_multiple_votes' => (bool) ($settings['allow_multiple_votes'] ?? false),
                    'max_votes'            => (int) ($settings['max_votes'] ?? 0),
                ]);
        }
    },
];
