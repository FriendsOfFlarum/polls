<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\integration;

trait InspectsQueries
{
    /**
     * The SQL of every query $callback runs.
     *
     * @return string[]
     */
    protected function queriesDuring(callable $callback): array
    {
        // Boot the app and populate the database before we start counting.
        $this->app();

        $db = $this->database();
        $db->enableQueryLog();
        $db->flushQueryLog();

        $callback();

        $queries = array_column($db->getQueryLog(), 'query');

        $db->disableQueryLog();

        return $queries;
    }

    /**
     * The table a query selects from, ignoring tables its subqueries read, and
     * without the table prefix CI runs with.
     */
    protected function selectsFrom(string $sql): ?string
    {
        $sql = str_replace(['`', '"', $this->database()->getTablePrefix() ?: "\0"], '', $sql);

        while (preg_match('/\([^()]*\)/', $sql)) {
            $sql = preg_replace('/\([^()]*\)/', '', $sql);
        }

        return preg_match('/^select\b.*?\bfrom\s+(\w+)/is', $sql, $matches) ? $matches[1] : null;
    }
}
