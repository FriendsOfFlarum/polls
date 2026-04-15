<?php

namespace FoF\Polls\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Polls\PollGroup;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<PollGroup>
 */
class PollGroupResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'poll_groups';
    }

    public function model(): string
    {
        return PollGroup::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Create::make()
                ->can('createPollGroup'),
            Endpoint\Delete::make()
                ->can('delete'),
            Endpoint\Show::make()
                ->authenticated(),
            Endpoint\Index::make()
                ->paginate(),
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


            Schema\Relationship\ToMany::make('polls')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('pollss'), // the serialized type of this relation (type of the relation model's API resource).
        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }
}
