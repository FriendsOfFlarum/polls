<?php

namespace Treefiction\Polls;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddApiRoutes::class);
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\AddDiscussionPollRelationship::class);
    $events->subscribe(Listeners\AddForumFieldRelationship::class);
    $events->subscribe(Listeners\SavePollToDatabase::class);
    $events->subscribe(Access\DiscussionPolicy::class);
};
