<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Filter;

use Carbon\Carbon;
use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;

class PollIsEndedFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'isEnded';
    }

    public function filter(SearchState $state, array|string $value, bool $negate): void
    {
        /** @var DatabaseSearchState $state */
        if ($negate) {
            // filter[-isEnded]=1 → active polls (not ended)
            $state->getQuery()->where(function ($query) {
                $query->whereNull('end_date')
                      ->orWhere('end_date', '>', Carbon::now());
            });
        } else {
            // filter[isEnded]=1 → ended polls
            $state->getQuery()
                ->whereNotNull('end_date')
                ->where('end_date', '<=', Carbon::now());
        }
    }
}
