<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * https://reflar.redevs.org
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Api\Controllers;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->css(__DIR__.'/resources/css/dist/DateTimePicker.min.css'),
    new Extend\Locales(__DIR__.'/resources/locale'),
    (new Extend\Routes('api'))
        ->get('/reflar/polls', 'polls.index', Controllers\ListPollController::class)
        ->patch('/reflar/polls/{id}', 'polls.update', Controllers\UpdatePollController::class)
        ->patch('/reflar/polls/{id}/endDate', 'polls.endDate.update', Controllers\UpdateEndDateController::class)
        ->delete('/reflar/polls/{id}', 'polls.delete', Controllers\DeletePollController::class)
        ->get('/reflar/polls/votes', 'polls.votes.index', Controllers\ListVotesController::class)
        ->post('/reflar/polls/votes', 'polls.votes.create', Controllers\CreateVoteController::class)
        ->patch('/reflar/polls/votes/{id}', 'polls.votes.update', Controllers\UpdateVoteController::class)
        ->post('/reflar/polls/answers', 'polls.answers.create', Controllers\CreateAnswerController::class)
        ->patch('/reflar/polls/answers/{id}', 'polls.answers.update', Controllers\UpdateAnswerController::class)
        ->delete('/reflar/polls/answers/{id}', 'polls.answers.delete', Controllers\DeleteAnswerController::class),
    function (Dispatcher $events) {
        $events->subscribe(Listeners\AddDiscussionPollRelationship::class);
        $events->subscribe(Listeners\SavePollToDatabase::class);
    },
];
