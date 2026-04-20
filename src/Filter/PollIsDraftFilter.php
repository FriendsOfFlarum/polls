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

class PollIsDraftFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'isDraft';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        // `any` means the caller wants no published/draft constraint — used
        // by the listing UI's "All" status filter. The mere presence of the
        // `isDraft` key also tells GlobalPollFilterer to drop its default
        // hide-drafts guard, so together these give us a true "show both".
        if (strtolower($filterValue) === 'any') {
            return;
        }

        if ($negate || !$filterValue) {
            $filterState->getQuery()->whereNotNull('polls.published_at');
        } else {
            $filterState->getQuery()->whereNull('polls.published_at');
        }
    }
}
