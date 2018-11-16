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

namespace Reflar\Polls\Listeners;

use Flarum\Api\Controller;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Question;

class AddDiscussionPollRelationship
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiRelationship']);
        $events->listen(WillGetData::class, [$this, 'includeRelationship']);
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param GetModelRelationship $event
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'Poll')) {
            return $event->model->hasOne(Question::class, 'discussion_id', 'id', null, 'end_date', 'Poll');
        }
    }

    /**
     * @param GetApiRelationship $event
     *
     * @return \Tobscure\JsonApi\Relationship
     */
    public function getApiRelationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'Poll')) {
            return $event->serializer->hasOne($event->model, QuestionSerializer::class, 'Poll');
        }
    }

    /**
     * @param Serializing $event
     */
    public function prepareApiAttributes(Serializing $event)
    {
        if ($event->isSerializer(UserSerializer::class)) {
            $event->attributes['canEditPolls'] = $event->actor->can('discussion.polls');
            $event->attributes['canStartPolls'] = $event->actor->can('startPolls');
            $event->attributes['canSelfEditPolls'] = $event->actor->can('selfEditPolls');
            $event->attributes['canVote'] = $event->actor->can('votePolls');
        }
    }

    /**
     * @param WillGetData $event
     */
    public function includeRelationship(WillGetData $event)
    {
        if ($event->isController(Controller\ListDiscussionsController::class)
            || $event->isController(Controller\ShowDiscussionController::class)
            || $event->isController(Controller\CreateDiscussionController::class)
            || $event->isController(Controller\UpdateDiscussionController::class)
        ) {
            $event->addInclude('Poll');
            $event->addInclude('Poll.answers');
            $event->addInclude('Poll.votes');
        }
    }
}
