<?php

use Flarum\Database\Migration;

return Migration::addColumns('polls', [
    'vote_count' => ['integer', 'unsigned' => true, 'default' => 0],
]);
