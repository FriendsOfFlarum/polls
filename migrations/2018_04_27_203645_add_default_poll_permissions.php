<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'startPolls'    => Group::MEMBER_ID,
    'votePolls'     => Group::MEMBER_ID,
    'selfEditPolls' => Group::MEMBER_ID,
]);
