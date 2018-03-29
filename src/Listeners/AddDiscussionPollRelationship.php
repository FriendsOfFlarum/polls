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

use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Core\Discussion;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Question;

class AddDiscussionPollRelationship
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiRelationship']);
        $events->listen(ConfigureApiController::class, [$this, 'includeRelationship']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'reflarPolls')) {
            return $event->model->hasOne(Question::class, 'discussion_id', 'id', null, 'reflarPolls');
        }
    }

    public function getApiRelationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'reflarPolls')) {
            return $event->serializer->hasOne($event->model, QuestionSerializer::class, 'reflarPolls');
        }
    }

    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes['canEditPoll'] = $event->actor->can('edit.polls') || $event->actor->id == $event->model->user_id;
        }
    }

    public function includeRelationship(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ListDiscussionsController::class)
            || $event->isController(Controller\ShowDiscussionController::class)
            || $event->isController(Controller\CreateDiscussionController::class)
            || $event->isController(Controller\UpdateDiscussionController::class)
        ) {
            $event->addInclude('reflarPolls');
            $event->addInclude('reflarPolls.answers');
            $event->addInclude('reflarPolls.votes');
        }
    }
}
