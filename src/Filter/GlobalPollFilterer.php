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

use Flarum\Filter\AbstractFilterer;
use Flarum\User\User;
use FoF\Polls\PollRepository;
use Illuminate\Database\Eloquent\Builder;

class GlobalPollFilterer extends AbstractFilterer
{
    protected $polls;

    public function __construct(PollRepository $polls, array $filters, array $filterMutators)
    {
        $this->polls = $polls;
        parent::__construct($filters, $filterMutators);
    }

    protected function getQuery(User $actor): Builder
    {
        return $this->polls->queryVisibleTo($actor)
            ->select('polls.*')
            ->whereNull('post_id')
            ->whereNull('poll_group_id');
    }
}
