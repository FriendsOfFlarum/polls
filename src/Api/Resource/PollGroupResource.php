<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Polls\Commands\CreatePollGroup;
use FoF\Polls\Commands\EditPollGroup;
use FoF\Polls\PollGroup;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<PollGroup>
 */
class PollGroupResource extends Resource\AbstractDatabaseResource
{
    public function __construct(
        protected \Flarum\Bus\Dispatcher $bus,
    ) {
    }

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
            Endpoint\Endpoint::make('create')
                ->route('POST', '/')
                ->authenticated()
                ->action(function (Context $context) {
                    return $this->bus->dispatch(
                        new CreatePollGroup(
                            $context->getActor(),
                            $context->body()['data'] ?? []
                        )
                    );
                })
                ->response(function (Context $context, PollGroup $group) {
                    $serializer = new \Flarum\Api\Serializer($context);

                    $serializer->addPrimary(
                        $context->resource($context->collection->resource($group, $context)),
                        $group,
                        [],
                    );

                    [$primary, $included] = $serializer->serialize();

                    $document = ['data' => $primary[0]];

                    if (count($included)) {
                        $document['included'] = $included;
                    }

                    return \Tobyz\JsonApiServer\json_api_response($document)
                        ->withStatus(201);
                }),
            Endpoint\Endpoint::make('update')
                ->route('PATCH', '/{id}')
                ->authenticated()
                ->action(function (Context $context) {
                    return $this->bus->dispatch(
                        new EditPollGroup(
                            $context->getActor(),
                            $context->modelId,
                            $context->body()['data'] ?? []
                        )
                    );
                }),
            Endpoint\Delete::make()
                ->authenticated()
                ->can('delete'),
            Endpoint\Show::make()
                ->defaultInclude(['polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option']),
            Endpoint\Index::make()
                ->paginate()
                ->defaultInclude(['polls']),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('name')
                ->requiredOnCreate()
                ->writable(fn () => true),
            Schema\DateTime::make('createdAt'),
            Schema\Boolean::make('canEdit')
                ->get(fn (PollGroup $group, Context $context) => $context->getActor()->can('edit', $group)),
            Schema\Boolean::make('canDelete')
                ->get(fn (PollGroup $group, Context $context) => $context->getActor()->can('delete', $group)),

            Schema\Relationship\ToMany::make('polls')
                ->includable()
                ->type('polls'),
            Schema\Relationship\ToOne::make('user')
                ->includable()
                ->type('users'),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('createdAt'),
        ];
    }

    /**
     * Null out poll_group_id on associated polls before deleting the group.
     * This handles the cascade in application code since SQLite does not
     * enforce foreign key ON DELETE SET NULL constraints by default.
     */
    public function deleting(object $model, \Tobyz\JsonApiServer\Context $context): void
    {
        $model->polls()->update(['poll_group_id' => null]);
    }
}
