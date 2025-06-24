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

use Flarum\Filter\FilterState;
use Flarum\Query\QueryCriteria;
use Illuminate\Support\Arr;

class HideGroupedPollsFromGlobalPolls
{
    public function __invoke(FilterState $filter, QueryCriteria $criteria)
    {
        if (!Arr::get($criteria->query, 'pollGroup', false)) {
            $filter->getQuery()->whereNull('polls.poll_group_id');
        }
    }
}
