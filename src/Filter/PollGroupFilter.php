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
