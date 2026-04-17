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
use FoF\Polls\PollGroupRepository;
use Illuminate\Database\Eloquent\Builder;

class PollGroupSearcher extends AbstractSearcher
{
    public function __construct(
        protected PollGroupRepository $pollGroups,
        \Flarum\Search\Filter\FilterManager $filters,
        array $mutators
    ) {
        parent::__construct($filters, $mutators);
    }

    public function getQuery(User $actor): Builder
    {
        return $this->pollGroups->queryVisibleTo($actor);
    }
}
