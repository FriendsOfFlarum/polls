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
        $routes->get(
            '/treefiction/polls/questions',
            'treefiction.polls.api.questions.index',
            Controllers\QuestionsIndexController::class
        );

        $routes->get(
            '/treefiction/polls/votes',
            'treefiction.polls.api.votes.index',
            Controllers\VotesIndexController::class
        );

        $routes->post(
            '/treefiction/polls/votes',
            'treefiction.polls.api.votes.store',
            Controllers\VotesStoreController::class
        );
    }
}
