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

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class PollGroupHasPollsFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'hasPolls';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $query = $filterState->getQuery();

        if ($negate) {
            // If negating, we want to find groups that do not have polls
            //@phpstan-ignore-next-line
            return $query->doesntHave('polls');
        }

        // Otherwise, we want to find groups that have at least one poll
        //@phpstan-ignore-next-line
        return $query->has('polls');
    }
}
