<?php

namespace FoF\Polls\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Polls\Poll;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<Poll>
 */
class PollResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'polls';
    }

    public function model(): string
    {
        return Poll::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Create::make()
                ->can('createPoll'),
            Endpoint\Delete::make()
                ->can('delete'),
            Endpoint\Show::make()
                ->authenticated(),
        ];
    }

    public function fields(): array
    {
        return [

            /**
             * @todo migrate logic from old serializer and controllers to this API Resource.
             * @see https://docs.flarum.org/2.x/extend/api#api-resources
             */

            // Example:
            Schema\Str::make('name')
                ->requiredOnCreate()
                ->minLength(3)
                ->maxLength(255)
                ->writable(),


            Schema\Relationship\ToMany::make('options')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('optionss'), // the serialized type of this relation (type of the relation model's API resource).
            Schema\Relationship\ToMany::make('votes')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('votess'), // the serialized type of this relation (type of the relation model's API resource).
            Schema\Relationship\ToMany::make('myVotes')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('myVotess'), // the serialized type of this relation (type of the relation model's API resource).
            Schema\Relationship\ToOne::make('pollGroup')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('pollGroups'), // the serialized type of this relation (type of the relation model's API resource).
        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }
}
