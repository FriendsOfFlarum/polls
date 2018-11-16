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

use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\GetApiRelationship;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Repositories\QuestionRepository;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class AddForumFieldRelationship
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetApiRelationship::class, [$this, 'addSerializerRelationship']);
        $events->listen(WillGetData::class, [$this, 'addSerializerInclude']);
    }

    /**
     * @param GetApiRelationship $event
     *
     * @return Relationship
     */
    public function addSerializerRelationship(GetApiRelationship $event)
    {
        // We add the list of fields as a Forum Serializer relationship so models are included with the forum when it loads
        if ($event->isRelationship(ForumSerializer::class, 'PollsQuestion')) {
            $fields = app(QuestionRepository::class);
            $serializer = app(QuestionSerializer::class);

            return new Relationship(new Collection($fields->all(), $serializer));
        }
    }

    /**
     * @param WillGetData $event
     */
    public function addSerializerInclude(WillGetData $event)
    {
        if ($event->controller->serializer === ForumSerializer::class) {
            $event->addInclude('PollsQuestion');
            $event->addInclude('PollsQuestion.answers');
            $event->addInclude('PollsQuestion.votes');
        }
    }
}
