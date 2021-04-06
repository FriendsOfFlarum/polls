<?php

use Flarum\Database\Migration;

return Migration::addColumns('poll_options', [
    'vote_count' => ['integer', 'unsigned' => true, 'default' => 0],
]);
