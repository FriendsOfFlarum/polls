<?php

namespace FoF\Polls\Filter;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class PollGroupFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'pollGroup';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $query = $filterState->getQuery();
        $query->where('poll_group_id', $negate ? '!=' : '=', $filterValue);
    }
}