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

use Flarum\Search\Database\AbstractSearcher;
use Flarum\User\User;
use FoF\Polls\PollRepository;
use Illuminate\Database\Eloquent\Builder;

class GlobalPollSearcher extends AbstractSearcher
{
    public function __construct(
        protected PollRepository $polls,
        \Flarum\Search\Filter\FilterManager $filters,
        array $mutators
    ) {
        parent::__construct($filters, $mutators);
    }

    public function getQuery(User $actor): Builder
    {
        return $this->polls->queryVisibleTo($actor)
            ->select('polls.*')
            ->whereNull('post_id')
            ->whereNull('poll_group_id');
    }
}
