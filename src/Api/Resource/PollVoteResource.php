<?php

namespace FoF\Polls\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Polls\PollVote;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<PollVote>
 */
class PollVoteResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'poll_votes';
    }

    public function model(): string
    {
        return PollVote::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
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


            Schema\Relationship\ToOne::make('poll')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('polls'), // the serialized type of this relation (type of the relation model's API resource).
            Schema\Relationship\ToOne::make('option')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('options'), // the serialized type of this relation (type of the relation model's API resource).
            Schema\Relationship\ToOne::make('user')
                ->includable()
                // ->inverse('?') // the inverse relationship name if any.
                ->type('users'), // the serialized type of this relation (type of the relation model's API resource).
        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }
}
