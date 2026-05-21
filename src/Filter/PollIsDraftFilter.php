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

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class PollIsDraftFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'isDraft';
    }

    public function filter(SearchState $state, array|string $value, bool $negate): void
    {
        // `any` means the caller wants no published/draft constraint — used by
        // the listing UI's "All" status filter to short-circuit the filter.
        if (is_string($value) && strtolower($value) === 'any') {
            return;
        }

        $wantsDrafts = !$negate && $value !== '' && $value !== '0';

        $state->getQuery()->{$wantsDrafts ? 'whereNull' : 'whereNotNull'}('polls.published_at');
    }
}
