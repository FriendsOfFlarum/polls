<?php

use Flarum\Database\Migration;

return Migration::dropColumns('polls', [
    'public_poll' => ['boolean', 'default' => false],
    'allow_multiple_votes' => ['boolean', 'default' => false],
    'max_votes' => ['integer', 'unsigned' => true, 'default' => 0],
]);
