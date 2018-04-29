<?php

use Illuminate\Database\ConnectionInterface;

$permissionAttributes = [
    [
        'group_id'   => 3,
        'permission' => 'startPolls',
    ],
    [
        'group_id'   => 3,
        'permission' => 'votePolls',
    ],
    [
        'group_id'   => 3,
        'permission' => 'selfEditPolls',
    ],
];

return [
    'up' => function (ConnectionInterface $db) use ($permissionAttributes) {
        foreach ($permissionAttributes as $permissionAttribute) {
            $instance = $db->table('permissions')->where($permissionAttribute)->first();

            if (is_null($instance)) {
                $db->table('permissions')->insert($permissionAttribute);
            }
        }
    },

    'down' => function (ConnectionInterface $db) use ($permissionAttributes) {
        foreach ($permissionAttributes as $permissionAttribute) {
            $db->table('permissions')->where($permissionAttribute)->delete();
        }
    },
];
