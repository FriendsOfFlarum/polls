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
use FoF\Polls\PollGroupRepository;
use Illuminate\Database\Eloquent\Builder;

class PollGroupFilterer extends AbstractFilterer
{
    protected $pollGroups;

    public function __construct(PollGroupRepository $pollGroups, array $filters, array $filterMutators)
    {
        $this->pollGroups = $pollGroups;
        parent::__construct($filters, $filterMutators);
    }

    protected function getQuery(User $actor): Builder
    {
        return $this->pollGroups->queryVisibleTo($actor);
    }
}
