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
use Flarum\Post\PostRepository;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Polls\Commands\CreatePoll;
use FoF\Polls\Commands\EditPoll;
use FoF\Polls\Commands\MultipleVotesPoll;
use FoF\Polls\Commands\PublishPoll;
use FoF\Polls\Commands\UnpublishPoll;
use FoF\Polls\Poll;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<Poll>
 */
class PollResource extends Resource\AbstractDatabaseResource
{
    public function __construct(
        protected \Flarum\Bus\Dispatcher $bus,
        protected PostRepository $posts,
        protected SettingsRepositoryInterface $settings,
        protected Factory $filesystemFactory,
        protected \FoF\Polls\PollImageUploader $uploader,
    ) {
    }

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
            Endpoint\Endpoint::make('create')
                ->route('POST', '/')
                ->authenticated()
                ->action(function (Context $context) {
                    $actor = $context->getActor();
                    $data = $context->body()['data'] ?? [];

                    $postId = $data['relationships']['post']['data']['id'] ?? null;

                    $post = null;
                    if ($postId !== null) {
                        $post = $this->posts->findOrFail($postId, $actor);
                    }

                    return $this->bus->dispatch(
                        new CreatePoll($actor, $post, $data)
                    );
                })
                ->response(function (Context $context, Poll $poll) {
                    $serializer = new \Flarum\Api\Serializer($context);

                    $serializer->addPrimary(
                        $context->resource($context->collection->resource($poll, $context)),
                        $poll,
                        ['options' => []],
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
                        new EditPoll(
                            $context->getActor(),
                            $context->modelId,
                            $context->body()['data'] ?? []
                        )
                    );
                })
                ->response(function (Context $context, Poll $poll) {
                    $poll->unsetRelation('options');
                    $poll->load('options');

                    Poll::setStateUser($context->getActor());
                    $poll->unsetRelation('myVotes');

                    $serializer = new \Flarum\Api\Serializer($context);

                    $serializer->addPrimary(
                        $context->resource($context->collection->resource($poll, $context)),
                        $poll,
                        [
                            'options' => [],
                            'myVotes' => [
                                'option' => [],
                            ],
                        ],
                    );

                    [$primary, $included] = $serializer->serialize();

                    $document = ['data' => $primary[0]];

                    if (count($included)) {
                        $document['included'] = $included;
                    }

                    return \Tobyz\JsonApiServer\json_api_response($document);
                }),
            Endpoint\Delete::make()
                ->authenticated()
                ->can('delete'),
            Endpoint\Show::make()
                ->defaultInclude(['options', 'myVotes', 'myVotes.option']),
            Endpoint\Index::make()
                ->paginate()
                ->defaultInclude(['options', 'votes', 'myVotes', 'myVotes.option'])
                ->defaultSort('-createdAt'),
            Endpoint\Endpoint::make('votes')
                ->route('PATCH', '/{id}/votes')
                ->authenticated()
                ->action(function (Context $context) {
                    return $this->bus->dispatch(
                        new MultipleVotesPoll(
                            $context->getActor(),
                            $context->modelId,
                            $context->body()['data'] ?? []
                        )
                    );
                })
                ->response(function (Context $context, Poll $poll) {
                    // Reload relations so the response includes updated vote counts
                    Poll::setStateUser($context->getActor());
                    $poll->unsetRelation('myVotes');
                    $poll->load(['options', 'myVotes']);

                    $serializer = new \Flarum\Api\Serializer($context);

                    $serializer->addPrimary(
                        $context->resource($context->collection->resource($poll, $context)),
                        $poll,
                        [
                            'options' => [],
                            'myVotes' => [
                                'option' => [],
                            ],
                        ],
                    );

                    [$primary, $included] = $serializer->serialize();

                    $document = ['data' => $primary[0]];

                    if (count($included)) {
                        $document['included'] = $included;
                    }

                    return \Tobyz\JsonApiServer\json_api_response($document);
                }),
            Endpoint\Endpoint::make('publish')
                ->route('POST', '/{id}/publish')
                ->authenticated()
                ->action(function (Context $context) {
                    return $this->bus->dispatch(
                        new PublishPoll(
                            (int) $context->modelId,
                            $context->getActor(),
                            $context->body()['data'] ?? []
                        )
                    );
                })
                ->response(fn (Context $context, Poll $poll) => $this->respondWithPoll($context, $poll)),
            Endpoint\Endpoint::make('unpublish')
                ->route('POST', '/{id}/unpublish')
                ->authenticated()
                ->action(function (Context $context) {
                    return $this->bus->dispatch(
                        new UnpublishPoll(
                            (int) $context->modelId,
                            $context->getActor(),
                            $context->body()['data'] ?? []
                        )
                    );
                })
                ->response(fn (Context $context, Poll $poll) => $this->respondWithPoll($context, $poll)),
        ];
    }

    protected function respondWithPoll(Context $context, Poll $poll): \Psr\Http\Message\ResponseInterface
    {
        $poll->unsetRelation('options');
        $poll->load('options');

        Poll::setStateUser($context->getActor());
        $poll->unsetRelation('myVotes');

        $serializer = new \Flarum\Api\Serializer($context);

        $serializer->addPrimary(
            $context->resource($context->collection->resource($poll, $context)),
            $poll,
            [
                'options' => [],
                'myVotes' => [
                    'option' => [],
                ],
            ],
        );

        [$primary, $included] = $serializer->serialize();

        $document = ['data' => $primary[0]];

        if (count($included)) {
            $document['included'] = $included;
        }

        return \Tobyz\JsonApiServer\json_api_response($document);
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('question')
                ->requiredOnCreate()
                ->writable(fn () => true),
            Schema\Str::make('subtitle')
                ->nullable()
                ->writable(fn () => true),
            Schema\Boolean::make('hasEnded')
                ->get(fn (Poll $poll) => $poll->hasEnded()),
            Schema\Boolean::make('allowMultipleVotes')
                ->get(fn (Poll $poll) => $poll->allow_multiple_votes),
            Schema\Integer::make('maxVotes')
                ->get(fn (Poll $poll) => $poll->max_votes),
            Schema\DateTime::make('endDate')
                ->get(fn (Poll $poll) => $poll->end_date),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),
            Schema\Boolean::make('canVote')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('vote', $poll)),
            Schema\Boolean::make('canEdit')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('edit', $poll)),
            Schema\Boolean::make('canDelete')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('delete', $poll)),
            Schema\Boolean::make('canSeeVoters')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('seeVoters', $poll)),
            Schema\Boolean::make('canChangeVote')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('changeVote', $poll)),
            Schema\Boolean::make('isGlobal')
                ->get(fn (Poll $poll) => $poll->isGlobal()),
            Schema\Str::make('image')
                ->nullable(),
            Schema\Str::make('imageUrl')
                ->get(fn (Poll $poll) => $this->getImageUrl($poll)),
            Schema\Str::make('imageSrcset')
                ->get(fn (Poll $poll) => $this->getImageSrcset($poll)),
            Schema\Str::make('imageAlt')
                ->nullable(),
            Schema\Boolean::make('publicPoll')
                ->get(fn (Poll $poll) => $poll->public_poll),
            Schema\Integer::make('voteCount')
                ->visible(fn (Poll $poll, Context $context) => $context->getActor()->can('seeVoteCount', $poll))
                ->get(fn (Poll $poll) => (int) $poll->vote_count),
            Schema\Boolean::make('hideVotes')
                ->visible(fn (Poll $poll, Context $context) => $context->getActor()->can('edit', $poll))
                ->get(fn (Poll $poll) => $poll->hide_votes),
            Schema\Boolean::make('allowChangeVote')
                ->visible(fn (Poll $poll, Context $context) => $context->getActor()->can('edit', $poll))
                ->get(fn (Poll $poll) => $poll->allow_change_vote),
            /**
             * @deprecated Will be removed in the next major version. Use imageSrcset presence instead.
             */
            Schema\Boolean::make('isImageUpload')
                ->visible(fn (Poll $poll) => $poll->image !== null)
                ->get(fn (Poll $poll) => !filter_var($poll->image, FILTER_VALIDATE_URL)),
            Schema\Boolean::make('isDraft')
                ->get(fn (Poll $poll) => $poll->isDraft()),
            Schema\DateTime::make('publishedAt')
                ->get(fn (Poll $poll) => $poll->published_at),
            Schema\DateTime::make('scheduledPublishAt')
                ->get(fn (Poll $poll) => $poll->scheduled_publish_at),
            Schema\Str::make('scheduledPublishError')
                ->visible(fn (Poll $poll, Context $context) => $context->getActor()->can('edit', $poll))
                ->get(fn (Poll $poll) => $poll->scheduled_publish_error),
            Schema\Boolean::make('canPublish')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('publish', $poll)),
            Schema\Boolean::make('canUnpublish')
                ->get(fn (Poll $poll, Context $context) => $context->getActor()->can('unpublish', $poll)),

            Schema\Relationship\ToMany::make('options')
                ->includable()
                ->type('poll_options'),
            Schema\Relationship\ToMany::make('votes')
                ->includable()
                ->visible(fn (Poll $poll, Context $context) => $context->getActor()->can('seeVoters', $poll))
                ->type('poll_votes'),
            Schema\Relationship\ToMany::make('myVotes')
                ->includable()
                ->type('poll_votes')
                ->get(function (Poll $poll, Context $context) {
                    Poll::setStateUser($context->getActor());

                    // The actor is constant within a request, so a relation
                    // loaded earlier (eager load or the vote policies) is
                    // this actor's — reuse it instead of re-querying per
                    // poll per serialized field.
                    if (! $poll->relationLoaded('myVotes')) {
                        $poll->setRelation('myVotes', $poll->myVotes($context->getActor())->get());
                    }

                    return $poll->getRelation('myVotes')->all();
                }),
            Schema\Relationship\ToOne::make('post')
                ->includable()
                ->type('posts'),
            Schema\Relationship\ToOne::make('user')
                ->includable()
                ->type('users'),
            Schema\Relationship\ToOne::make('pollGroup')
                ->includable()
                ->type('poll_groups'),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('createdAt'),
            SortColumn::make('voteCount'),
        ];
    }

    protected function getImageUrl(Poll $poll): ?string
    {
        if ($poll->image === null) {
            return null;
        }

        /**
         * @deprecated External URL images are deprecated and will be removed in the next major version.
         */
        if (filter_var($poll->image, FILTER_VALIDATE_URL)) {
            return $poll->image;
        }

        return $this->uploader->url($poll->image);
    }

    protected function getImageSrcset(Poll $poll): ?string
    {
        if ($poll->image === null) {
            return null;
        }

        return $this->uploader->srcsetFor($poll->image);
    }
}
