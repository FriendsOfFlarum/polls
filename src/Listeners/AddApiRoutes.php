<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls\Listeners;

use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Api\Controllers;

class AddApiRoutes
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'routes']);
    }

    /**
     * @param ConfigureApiRoutes $routes
     */
    public function routes(ConfigureApiRoutes $routes)
    {
        // API Route to get all votes
        $routes->get(
            '/votes',
            'votes.index',
            Controllers\ListVotesController::class
        );

        // API Route to store votes
        $routes->post(
            '/votes',
            'votes.create',
            Controllers\CreateVoteController::class
        );

        // API Route to store answer
        $routes->post(
            '/answers',
            'answers.create',
            Controllers\CreateAnswerController::class
        );

        // API Route to get all polls
        $routes->get(
            '/questions',
            'questions.index',
            Controllers\ListPollController::class
        );

        // API Route to update a poll
        $routes->patch(
            '/questions/{id}',
            'poll.update',
            Controllers\UpdatePollController::class
        );

        // API Route to update an answer
        $routes->patch(
            '/answers/{id}',
            'answers.update',
            Controllers\UpdateAnswerController::class
        );

        // API Route to delete a poll
        $routes->delete(
            '/questions/{id}',
            'poll.delete',
            Controllers\DeletePollController::class
        );

        // API Route to delete an answer
        $routes->delete(
            '/answers/{id}',
            'answer.delete',
            Controllers\DeleteAnswerController::class
        );
    }
}
