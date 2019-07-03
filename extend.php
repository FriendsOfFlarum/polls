<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Polls;

use Flarum\Discussion\Event\Saving;
use Flarum\Extend;
use FoF\Polls\Api\Controllers;
use Illuminate\Events\Dispatcher;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),
    new Extend\Locales(__DIR__ . '/resources/locale'),
    (new Extend\Routes('api'))
        ->patch('/fof/polls/{id}', 'fof.polls.edit', Controllers\EditPollController::class)
        ->delete('/fof/polls/{id}', 'fof.polls.delete', Controllers\DeletePollController::class)
        ->patch('/fof/polls/{id}/vote', 'fof.polls.vote', Controllers\VotePollController::class),
    new Extend\Compat(function (Dispatcher $events) {
        $events->subscribe(Listeners\AddDiscussionPollRelationship::class);
        $events->listen(Saving::class, Listeners\SavePollsToDatabase::class);
    })
];
