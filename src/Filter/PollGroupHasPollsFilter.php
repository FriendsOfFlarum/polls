<?php

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
            return $query->doesntHave('polls');
        }

        // Otherwise, we want to find groups that have at least one poll
        return $query->has('polls');
    }
}