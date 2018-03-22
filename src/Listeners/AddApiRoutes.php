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
            Controllers\VotesIndexController::class
        );

        // API Route to store votes
        $routes->post(
            '/treefiction/polls/votes',
            'treefiction.polls.api.votes.store',
            Controllers\VotesStoreController::class
        );

        // API Route to get all questions
        $routes->get(
            '/treefiction/polls/questions',
            'treefiction.polls.api.questions.index',
            Controllers\QuestionsIndexController::class
        );

        // API Route to store votes
        $routes->patch(
            '/treefiction/polls/questions/{id}',
            'treefiction.polls.api.poll.update',
            Controllers\UpdatePollController::class
        );

        // API Route to store votes
        $routes->delete(
            '/treefiction/polls/questions/{id}',
            'treefiction.polls.api.poll.delete',
            Controllers\DeletePollController::class
        );
    }
}
