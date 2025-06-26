<?php

namespace FoF\Polls\Filter;

use Carbon\Carbon;
use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class PollIsEndedFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'isEnded';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        if ($negate) {
            return $filterState->getQuery()->whereNull('end_date')->orWhere('end_date', '<=', Carbon::now());
        }

        return $filterState->getQuery()->where('end_date', '>', Carbon::now());
    }
}