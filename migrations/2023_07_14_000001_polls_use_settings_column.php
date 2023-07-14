<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $db->table('polls')
            ->select(1)
            ->update([
                'settings' => $db->raw(<<<SQL
JSON_OBJECT(
    "public_poll", public_poll,
    "allow_multiple_votes", allow_multiple_votes,
    "max_votes", max_votes
)
SQL),
            ]);
    },
    'down' => function (Builder $schema) {
        $db = $schema->getConnection();

        $db->table('polls')
            ->select(1)
            ->update([
                'public_poll' => $db->raw('JSON_EXTRACT(settings, "$.public_poll")'),
                'allow_multiple_votes' => $db->raw('JSON_EXTRACT(settings, "$.allow_multiple_votes")'),
                'max_votes' => $db->raw('JSON_EXTRACT(settings, "$.max_votes")'),
            ]);
    }
];
