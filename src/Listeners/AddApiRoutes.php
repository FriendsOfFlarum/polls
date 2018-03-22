<?php

namespace Treefiction\Polls\Listeners;

use Treefiction\Polls\Api\Controllers;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;

class AddApiRoutes
{
    
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'routes']);
    }

    public function routes(ConfigureApiRoutes $routes)
    {
        // API Route to get all votes
        $routes->get(
            '/treefiction/polls/votes',
            'treefiction.polls.api.votes.index',
            Controllers\ListVotesController::class
        );

        // API Route to store votes
        $routes->post(
            '/treefiction/polls/votes',
            'treefiction.polls.api.votes.create',
            Controllers\CreateVotesController::class
        );

        // API Route to get all polls
        $routes->get(
            '/treefiction/polls/questions',
            'treefiction.polls.api.questions.index',
            Controllers\ListPollController::class
        );

        // API Route to update a poll
        $routes->patch(
            '/treefiction/polls/questions/{id}',
            'treefiction.polls.api.poll.update',
            Controllers\UpdatePollController::class
        );

        // API Route to delete a poll
        $routes->delete(
            '/treefiction/polls/questions/{id}',
            'treefiction.polls.api.poll.delete',
            Controllers\DeletePollController::class
        );
    }
}
