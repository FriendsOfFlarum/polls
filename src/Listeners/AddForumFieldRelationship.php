<?php

namespace Treefiction\Polls\Listeners;

use Treefiction\Polls\Api\Serializers\QuestionSerializer;
use Treefiction\Polls\Repositories\QuestionRepository;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Illuminate\Contracts\Events\Dispatcher;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class AddForumFieldRelationship
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetApiRelationship::class, [$this, 'addSerializerRelationship']);
        $events->listen(ConfigureApiController::class, [$this, 'addSerializerInclude']);
    }

    public function addSerializerRelationship(GetApiRelationship $event)
    {
        // We add the list of fields as a Forum Serializer relationship so models are included with the forum when it loads
        if ($event->isRelationship(ForumSerializer::class, 'treefictionPollsQuestion')) {

            $fields = app(QuestionRepository::class);
            $serializer = app(QuestionSerializer::class);

            return new Relationship(new Collection($fields->all(), $serializer));
        }
    }

    public function addSerializerInclude(ConfigureApiController $event)
    {
        if ($event->controller->serializer === ForumSerializer::class ) {
            $event->addInclude('treefictionPollsQuestion');
            $event->addInclude('treefictionPollsQuestion.answers');
            $event->addInclude('treefictionPollsQuestion.votes');
        }
    }
}
