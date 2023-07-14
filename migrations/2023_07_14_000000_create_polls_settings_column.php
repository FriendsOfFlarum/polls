<?php

use Flarum\Database\Migration;

return Migration::addColumns('polls', [
    'settings' => ['json']
]);
