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
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
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
        ->get('/fof/polls/{id}', 'fof.polls.show', Controllers\ShowPollController::class)
        ->patch('/fof/polls/{id}', 'fof.polls.edit', Controllers\EditPollController::class)
        ->delete('/fof/polls/{id}', 'fof.polls.delete', Controllers\DeletePollController::class)
        ->patch('/fof/polls/{id}/vote', 'fof.polls.vote', Controllers\VotePollController::class)
        ->patch('/fof/polls/{id}/votes', 'fof.polls.votes', Controllers\MultipleVotesPollController::class),

    (new Extend\Model(Post::class))
        ->hasMany('polls', Poll::class, 'post_id', 'id'),

    (new Extend\Model(Discussion::class))
        ->hasMany('polls', Poll::class, 'post_id', 'first_post_id'),

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SavePollsToDatabase::class),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attribute('hasPoll', function (DiscussionSerializer $serializer, Discussion $discussion): bool {
            return $discussion->polls()->exists();
        }),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->hasMany('polls', PollSerializer::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(function (UserSerializer $serializer): array {
            return [
                'canEditPolls'     => $serializer->getActor()->can('discussion.polls'), // Not used by the extension frontend anymore
                'canStartPolls'    => $serializer->getActor()->can('startPolls'),
                'canSelfEditPolls' => $serializer->getActor()->can('selfEditPolls'), // Not used by the extension frontend anymore
                'canVotePolls'     => $serializer->getActor()->can('votePolls'),
            ];
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
        ->modelPolicy(Poll::class, Access\PollPolicy::class),

    (new Extend\Settings())
        ->serializeToForum('allowPollOptionImage', 'fof-polls.allowOptionImage', 'boolval'),
];
