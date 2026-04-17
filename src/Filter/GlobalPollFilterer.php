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

    protected $filters;

    public function __construct(PollRepository $polls, ?array $filters, array $filterMutators)
    {
        $this->polls = $polls;
        $this->filters = $filters;
        parent::__construct($filters, $filterMutators);
    }

    protected function getQuery(User $actor): Builder
    {
        $query = $this->polls->queryVisibleTo($actor)
            ->select('polls.*')
            ->whereNull('post_id')
            ->whereNull('poll_group_id');

        // Default to published-only unless caller explicitly asked for drafts.
        $hasIsDraftFilter = is_array($this->filters) && array_key_exists('isDraft', $this->filters);
        $hasNegatedIsDraftFilter = is_array($this->filters) && array_key_exists('-isDraft', $this->filters);

        if (!$hasIsDraftFilter && !$hasNegatedIsDraftFilter) {
            $query->whereNotNull('polls.published_at');
        }

        return $query;
    }
}
