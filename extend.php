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
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Extend;
use Flarum\User\User;
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
        ->patch('/fof/polls/{id}', 'fof.polls.edit', Controllers\EditPollController::class)
        ->delete('/fof/polls/{id}', 'fof.polls.delete', Controllers\DeletePollController::class)
        ->patch('/fof/polls/{id}/vote', 'fof.polls.vote', Controllers\VotePollController::class),

    (new Extend\Model(Discussion::class))
        ->hasOne('poll', Poll::class, 'discussion_id', 'id'),

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SavePollsToDatabase::class),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->hasOne('poll', PollSerializer::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->mutate(function (UserSerializer $serializer, User $user, array $attributes): array {
            $attributes['canEditPolls'] = $serializer->getActor()->can('discussion.polls');
            $attributes['canStartPolls'] = $serializer->getActor()->can('startPolls');
            $attributes['canSelfEditPolls'] = $serializer->getActor()->can('selfEditPolls');
            $attributes['canVotePolls'] = $serializer->getActor()->can('votePolls');

            return $attributes;
        }),

    (new Extend\ApiController(Controller\ListDiscussionsController::class))
        ->addInclude('poll'),

    (new Extend\ApiController(Controller\ShowDiscussionController::class))
        ->addInclude(['poll', 'poll.options', 'poll.myVotes', 'poll.myVotes.option'])
        ->addOptionalInclude(['poll.votes', 'poll.votes.user', 'poll.votes.option']),

    (new Extend\ApiController(Controller\CreateDiscussionController::class))
        ->addInclude(['poll', 'poll.options', 'poll.myVotes', 'poll.myVotes.option'])
        ->addOptionalInclude(['poll.votes', 'poll.votes.user', 'poll.votes.option']),

    (new Extend\ApiController(Controller\UpdateDiscussionController::class))
        ->addInclude(['poll', 'poll.options', 'poll.myVotes', 'poll.myVotes.option'])
        ->addOptionalInclude(['poll.votes', 'poll.votes.user', 'poll.votes.option']),

    (new Extend\Console())
        ->command(Console\RefreshVoteCountCommand::class),
];
