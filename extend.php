<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls;

use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Context;
use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Event\Saving as PostSaving;
use Flarum\Post\Post;
use Flarum\Settings\Event\Saved as SettingsSaved;
use FoF\Polls\Api\Controllers;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->route('/polls', 'fof.polls.showcase')
        ->route('/polls/all', 'fof.polls.list', Content\PollsDirectory::class)
        ->route('/polls/view/{id}', 'fof.poll.view')
        ->route('/polls/composer', 'fof.polls.composer')
        ->jsDirectory(__DIR__.'/js/dist/forum'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    // Image upload/delete routes (non-JSON:API endpoints)
    (new Extend\Routes('api'))
        ->post('/polls/pollImage', 'fof.polls.upload-image', Controllers\UploadPollImageController::class)
        ->delete('/polls/pollImage/name/{fileName}', 'fof.polls.delete-image-name', Controllers\DeletePollImageByNameController::class)
        ->post('/polls/pollImage/{pollId:\d+}', 'fof.polls.upload-image-poll', Controllers\UploadPollImageController::class)
        ->delete('/polls/pollImage/{pollId:\d+}', 'fof.polls.delete-image-poll', Controllers\DeletePollImageController::class)
        ->post('/polls/pollOptionImage', 'fof.polls.upload-option-image-option', Controllers\UploadPollOptionImageController::class)
        ->delete('/polls/pollOptionImage/name/{fileName}', 'fof.polls.delete-option-image-name', Controllers\DeletePollImageByNameController::class)
        ->post('/polls/pollOptionImage/{optionId:\d+}', 'fof.polls.upload-option-image', Controllers\UploadPollOptionImageController::class)
        ->delete('/polls/pollOptionImage/{optionId:\d+}', 'fof.polls.delete-option-image', Controllers\DeletePollOptionImageController::class),

    (new Extend\Model(Post::class))
        ->hasMany('polls', Poll::class, 'post_id', 'id'),

    (new Extend\Model(Discussion::class))
        ->hasMany('polls', Poll::class, 'post_id', 'first_post_id'),

    (new Extend\Event())
        ->listen(PostSaving::class, Listeners\SavePollsToDatabase::class)
        ->listen(SettingsSaved::class, Listeners\ClearFormatterCache::class),

    // Add poll-related attributes to Discussion resource
    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(fn () => [
            Schema\Boolean::make('hasPoll')
                ->get(function (Discussion $discussion) {
                    return $discussion->relationLoaded('polls')
                        ? $discussion->polls->isNotEmpty()
                        : $discussion->polls()->exists();
                }),
            Schema\Boolean::make('canStartPoll')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('polls.start', $discussion)),
            Schema\Arr::make('poll')
                ->writableOnCreate()
                ->visible(false)
                ->set(function (Discussion $discussion, ?array $value) {
                    // Stash poll data for SavePollsToDatabase listener.
                    // In Flarum 2.x, DiscussionResource creates the first post internally
                    // and only passes 'content' — the poll data is lost in transit.
                    Listeners\SavePollsToDatabase::$pendingPollData = $value;
                }),
        ])
        ->endpoint('index', function ($endpoint) {
            return $endpoint
                ->eagerLoadWhere('polls', function ($query) {
                    $query->select(['id', 'post_id']);
                })
                ->addDefaultInclude(['firstPost.polls']);
        })
        ->endpoint('show', function ($endpoint) {
            return $endpoint->addDefaultInclude([
                'firstPost.polls', 'firstPost.polls.options', 'firstPost.polls.myVotes', 'firstPost.polls.myVotes.option',
            ]);
        }),

    // Add poll-related attributes/relationships to Post resource
    (new Extend\ApiResource(Resource\PostResource::class))
        ->fields(fn () => [
            Schema\Boolean::make('canStartPoll')
                ->get(fn (Post $post, Context $context) => $context->getActor()->can('startPoll', $post)),
            Schema\Arr::make('poll')
                ->writableOnCreate()
                ->visible(false)
                ->set(fn () => null),
            Schema\Relationship\ToMany::make('polls')
                ->includable()
                ->type('polls'),
        ])
        ->endpoint('create', function ($endpoint) {
            return $endpoint->addDefaultInclude([
                'polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option',
            ]);
        })
        ->endpoint('index', function ($endpoint) {
            return $endpoint->addDefaultInclude([
                'polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option',
            ]);
        })
        ->endpoint('show', function ($endpoint) {
            return $endpoint->addDefaultInclude([
                'polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option',
            ]);
        }),

    // Add poll-related attributes to Forum resource
    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(function () {
            return [
                Schema\Boolean::make('canStartPolls')
                    ->get(fn ($forum, Context $context) => $context->getActor()->can('discussion.polls.start')),
                Schema\Boolean::make('canStartGlobalPolls')
                    ->get(fn ($forum, Context $context) => $context->getActor()->can('startGlobalPoll')),
                Schema\Boolean::make('canUploadPollImages')
                    ->get(fn ($forum, Context $context) => $context->getActor()->can('uploadPollImages')),
                Schema\Boolean::make('canStartPollGroup')
                    ->get(function ($forum, Context $context) {
                        $settings = resolve(\Flarum\Settings\SettingsRepositoryInterface::class);

                        return (bool) $settings->get('fof-polls.enablePollGroups', false) && $context->getActor()->can('startPollGroup');
                    }),
                Schema\Boolean::make('canViewPollGroups')
                    ->get(function ($forum, Context $context) {
                        $settings = resolve(\Flarum\Settings\SettingsRepositoryInterface::class);

                        return (bool) $settings->get('fof-polls.enablePollGroups', false) && $context->getActor()->can('viewPollGroups');
                    }),
            ];
        }),

    (new Extend\Console())
        ->command(Console\RefreshVoteCountCommand::class)
        ->command(Console\ConvertPollImagesCommand::class),

    (new Extend\Policy())
        ->modelPolicy(Poll::class, Access\PollPolicy::class)
        ->modelPolicy(Post::class, Access\PostPolicy::class),

    (new Extend\Settings())
        ->default('fof-polls.maxOptions', 10)
        ->default('fof-polls.optionsColorBlend', true)
        ->default('fof-polls.directory-default-sort', '-createdAt')
        ->default('fof-polls.enableGlobalPolls', false)
        ->default('fof-polls.image_height', 250)
        ->default('fof-polls.image_width', 250)
        ->default('fof-polls.maxImageUploadSize', 10240)
        ->serializeToForum('pollsDirectoryDefaultSort', 'fof-polls.directory-default-sort', 'strval')
        ->serializeToForum('globalPollsEnabled', 'fof-polls.enableGlobalPolls', 'boolval')
        ->serializeToForum('pollGroupsEnabled', 'fof-polls.enablePollGroups', 'boolval')
        ->serializeToForum('pollMaxOptions', 'fof-polls.maxOptions', 'intval')
        ->registerLessConfigVar('fof-polls-options-color-blend', 'fof-polls.optionsColorBlend', function ($value) {
            return $value ? 'true' : 'false';
        }),

    (new Extend\ModelVisibility(Poll::class))
        ->scope(Access\ScopePollVisibility::class),

    (new Extend\View())
        ->namespace('fof-polls', __DIR__.'/resources/views'),

    (new Extend\Filesystem())
        ->disk('fof-polls', PollImageDisk::class),

    // Resources (always registered — endpoints within handle their own access control)
    new Extend\ApiResource(Api\Resource\PollResource::class),
    new Extend\ApiResource(Api\Resource\PollOptionResource::class),
    new Extend\ApiResource(Api\Resource\PollVoteResource::class),
    new Extend\ApiResource(Api\Resource\PollGroupResource::class),

    // Search drivers
    (new Extend\SearchDriver(\Flarum\Search\Database\DatabaseSearchDriver::class))
        ->addSearcher(Poll::class, Filter\GlobalPollSearcher::class)
        ->addFilter(Filter\GlobalPollSearcher::class, Filter\PollIsEndedFilter::class)
        ->addSearcher(PollGroup::class, Filter\PollGroupSearcher::class)
        ->addFilter(Filter\PollGroupSearcher::class, Filter\PollGroupHasPollsFilter::class),

    (new Extend\Conditional())
        ->when(new Extender\IsPollGroupEnabled(), function () {
            return [
                (new Extend\Policy())
                    ->modelPolicy(PollGroup::class, Access\PollGroupPolicy::class),

                (new Extend\Frontend('forum'))
                    ->route('/polls/groups/composer', 'fof.polls.groups.composer')
                    ->route('/polls/groups', 'fof.polls.groups.list')
                    ->route('/polls/groups/{id}', 'fof.polls.groups.view'),
            ];
        }),
];
