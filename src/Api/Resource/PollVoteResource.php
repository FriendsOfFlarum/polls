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

use Flarum\Api\Resource;
use Flarum\Api\Schema;
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
        // Votes are visible if their parent poll is visible.
        $query->whereHas('poll', function (Builder $query) use ($context) {
            $query->whereVisibleTo($context->getActor());
        });
    }

    public function endpoints(): array
    {
        return [];
    }

    public function fields(): array
    {
        return [
            Schema\Integer::make('pollId')
                ->get(fn (PollVote $vote) => $vote->poll_id),
            Schema\Integer::make('optionId')
                ->get(fn (PollVote $vote) => $vote->option_id),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),

            Schema\Relationship\ToOne::make('poll')
                ->includable()
                ->type('polls'),
            Schema\Relationship\ToOne::make('option')
                ->includable()
                ->type('poll_options'),
            Schema\Relationship\ToOne::make('user')
                ->includable()
                ->type('users'),
        ];
    }

    public function sorts(): array
    {
        return [];
    }
}
