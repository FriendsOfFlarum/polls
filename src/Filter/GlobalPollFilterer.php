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
use Flarum\Query\QueryCriteria;
use Flarum\Query\QueryResults;
use Flarum\User\User;
use FoF\Polls\PollRepository;
use Illuminate\Database\Eloquent\Builder;

class GlobalPollFilterer extends AbstractFilterer
{
    protected $polls;

    /**
     * Whether the current filter() call should default to published-only.
     * Set from filter() based on request params; read from getQuery().
     */
    protected bool $defaultToPublished = true;

    public function __construct(PollRepository $polls, ?array $filters, array $filterMutators)
    {
        $this->polls = $polls;
        parent::__construct($filters ?? [], $filterMutators);
    }

    public function filter(QueryCriteria $criteria, int $limit = null, int $offset = 0): QueryResults
    {
        // If the caller explicitly asks about drafts (via `filter[isDraft]=…`
        // or the negated `filter[-isDraft]=…`), let PollIsDraftFilter decide —
        // otherwise the showcase/default list hides drafts.
        $requestFilters = $criteria->query;
        $this->defaultToPublished = !array_key_exists('isDraft', $requestFilters)
            && !array_key_exists('-isDraft', $requestFilters);

        return parent::filter($criteria, $limit, $offset);
    }

    protected function getQuery(User $actor): Builder
    {
        $query = $this->polls->queryVisibleTo($actor)
            ->select('polls.*')
            ->whereNull('post_id')
            ->whereNull('poll_group_id');

        if ($this->defaultToPublished) {
            $query->whereNotNull('polls.published_at');
        }

        return $query;
    }
}
