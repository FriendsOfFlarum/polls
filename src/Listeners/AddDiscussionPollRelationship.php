<?php

namespace Reflar\Polls\Listeners;

use Reflar\Polls\Question;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Core\Discussion;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddDiscussionPollRelationship
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiRelationship']);
        $events->listen(ConfigureApiController::class, [$this, 'includeRelationship']);
    }

    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'treefictionPolls')) {
            return $event->model->hasOne(Question::class, 'discussion_id', 'id', null, 'treefictionPolls');
        }
    }

    public function getApiRelationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'treefictionPolls')) {
            return $event->serializer->hasOne($event->model, QuestionSerializer::class, 'treefictionPolls');
        }
    }

    public function includeRelationship(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ListDiscussionsController::class)
            || $event->isController(Controller\ShowDiscussionController::class)
            || $event->isController(Controller\CreateDiscussionController::class)
            || $event->isController(Controller\UpdateDiscussionController::class)
        ) {
            $event->addInclude('treefictionPolls');
            $event->addInclude('treefictionPolls.answers');
            $event->addInclude('treefictionPolls.votes');
        }
    }
}
