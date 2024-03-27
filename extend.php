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

use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\PostSerializer;
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
        ->route('/polls/composer', 'fof.polls.composer'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Routes('api'))
        ->post('/fof/polls', 'fof.polls.create', Controllers\CreatePollController::class)
        ->get('/fof/polls', 'fof.polls.index', Controllers\ListGlobalPollsController::class)
        ->get('/fof/polls/{id}', 'fof.polls.show', Controllers\ShowPollController::class)
        ->patch('/fof/polls/{id}', 'fof.polls.edit', Controllers\EditPollController::class)
        ->delete('/fof/polls/{id}', 'fof.polls.delete', Controllers\DeletePollController::class)
        ->patch('/fof/polls/{id}/votes', 'fof.polls.votes', Controllers\MultipleVotesPollController::class)
        ->post('/fof/polls/pollImage', 'fof.polls.upload-image', Controllers\UploadPollImageController::class)
        ->post('/fof/polls/pollImage/{pollId}', 'fof.polls.upload-image-poll', Controllers\UploadPollImageController::class)
        ->delete('/fof/polls/pollImage/{pollId}', 'fof.polls.delete-image-poll', Controllers\DeletePollImageController::class)
        ->post('/fof/polls/pollOptionImage', 'fof.polls.upload-option-image-option', Controllers\UploadPollOptionImageController::class)
        ->post('/fof/polls/pollOptionImage/{optionId}', 'fof.polls.upload-option-image', Controllers\UploadPollOptionImageController::class)
        ->delete('/fof/polls/pollOptionImage/{optionId}', 'fof.polls.delete-option-image', Controllers\DeletePollOptionImageController::class),

    (new Extend\Model(Post::class))
        ->hasMany('polls', Poll::class, 'post_id', 'id'),

    (new Extend\Model(Discussion::class))
        ->hasMany('polls', Poll::class, 'post_id', 'first_post_id'),

    (new Extend\Event())
        ->listen(PostSaving::class, Listeners\SavePollsToDatabase::class)
        ->listen(SettingsSaved::class, Listeners\ClearFormatterCache::class),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attributes(Api\AddDiscussionAttributes::class),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->hasMany('polls', Api\Serializers\PollSerializer::class)
        ->attributes(Api\AddPostAttributes::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(Api\AddForumAttributes::class),

    (new Extend\ApiController(Controller\ListDiscussionsController::class))
        ->addOptionalInclude(['firstPost.polls']),

    (new Extend\ApiController(Controller\ShowDiscussionController::class))
        ->addInclude(['posts.polls', 'posts.polls.options', 'posts.polls.myVotes', 'posts.polls.myVotes.option'])
        ->addOptionalInclude(['posts.polls.votes', 'posts.polls.votes.user', 'posts.polls.votes.option']),

    (new Extend\ApiController(Controller\CreateDiscussionController::class))
        ->addInclude(['firstPost.polls', 'firstPost.polls.options', 'firstPost.polls.myVotes', 'firstPost.polls.myVotes.option'])
        ->addOptionalInclude(['firstPost.polls.votes', 'firstPost.polls.votes.user', 'firstPost.polls.votes.option']),

    (new Extend\ApiController(Controller\CreatePostController::class))
        ->addInclude(['polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option'])
        ->addOptionalInclude(['polls.votes', 'polls.votes.user', 'polls.votes.option']),

    (new Extend\ApiController(Controller\ListPostsController::class))
        ->addInclude(['polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option'])
        ->addOptionalInclude(['polls.votes', 'polls.votes.user', 'polls.votes.option']),

    (new Extend\ApiController(Controller\ShowPostController::class))
        ->addInclude(['polls', 'polls.options', 'polls.myVotes', 'polls.myVotes.option'])
        ->addOptionalInclude(['polls.votes', 'polls.votes.user', 'polls.votes.option']),

    (new Extend\Console())
        ->command(Console\RefreshVoteCountCommand::class),

    (new Extend\Policy())
        ->modelPolicy(Poll::class, Access\PollPolicy::class)
        ->modelPolicy(Post::class, Access\PostPolicy::class),

    (new Extend\Settings())
        ->default('fof-polls.maxOptions', 10)
        ->default('fof-polls.optionsColorBlend', true)
        ->default('fof-polls.directory-default-sort', 'default')
        ->default('fof-polls.enableGlobalPolls', false)
        ->default('fof-polls.image_height', 250)
        ->default('fof-polls.image_width', 250)
        ->serializeToForum('globalPollsEnabled', 'fof-polls.enableGlobalPolls', 'boolval')
        ->serializeToForum('allowPollOptionImage', 'fof-polls.allowOptionImage', 'boolval')
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
];
