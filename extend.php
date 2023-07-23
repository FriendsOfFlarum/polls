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
use FoF\Polls\Api\Serializers\PollSerializer;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Routes('api'))
        ->post('/fof/polls', 'fof.polls.create', Controllers\CreatePollController::class)
        ->get('/fof/polls/{id}', 'fof.polls.show', Controllers\ShowPollController::class)
        ->patch('/fof/polls/{id}', 'fof.polls.edit', Controllers\EditPollController::class)
        ->delete('/fof/polls/{id}', 'fof.polls.delete', Controllers\DeletePollController::class)
        ->patch('/fof/polls/{id}/votes', 'fof.polls.votes', Controllers\MultipleVotesPollController::class),

    (new Extend\Model(Post::class))
        ->hasMany('polls', Poll::class, 'post_id', 'id'),

    (new Extend\Model(Discussion::class))
        ->hasMany('polls', Poll::class, 'post_id', 'first_post_id'),

    (new Extend\Event())
        ->listen(PostSaving::class, Listeners\SavePollsToDatabase::class)
        ->listen(SettingsSaved::class, function (SettingsSaved $event) {
            foreach ($event->settings as $key => $value) {
                if ($key === 'fof-polls.optionsColorBlend') {
                    resolve('fof-user-bio.formatter')->flush();
                    return;
                }
            }
        }),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attribute('hasPoll', function (DiscussionSerializer $serializer, Discussion $discussion): bool {
            return $discussion->polls()->exists();
        })
        ->attribute('canStartPoll', function (DiscussionSerializer $serializer, Discussion $discussion): bool {
            return $serializer->getActor()->can('polls.start', $discussion);
        }),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->hasMany('polls', PollSerializer::class)
        ->attribute('canStartPoll', function (PostSerializer $serializer, Post $post): bool {
            return $serializer->getActor()->can('startPoll', $post);
        }),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canStartPolls', function (ForumSerializer $serializer): bool {
            return $serializer->getActor()->can('discussion.polls.start');
        }),

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
        ->serializeToForum('allowPollOptionImage', 'fof-polls.allowOptionImage', 'boolval')
        ->serializeToForum('pollMaxOptions', 'fof-polls.maxOptions', 'intval')
        ->registerLessConfigVar('fof-polls-options-color-blend', 'fof-polls.optionsColorBlend', function ($value) {
            return $value ? 'true' : 'false';
        }),

    (new Extend\ModelVisibility(Poll::class))
        ->scope(Access\ScopePollVisibility::class),
];
