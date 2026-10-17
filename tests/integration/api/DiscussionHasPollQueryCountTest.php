<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\integration\api;

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Polls\Poll;
use PHPUnit\Framework\Attributes\Test;

/**
 * `hasPoll` on discussions serialized outside the discussion list: here, the
 * discussions a user's posts belong to on their profile (`GET /api/posts`).
 *
 * Only the discussion index eager-loads `polls`, so everywhere else `hasPoll`
 * ran one `exists` query per discussion. It must be resolved for the whole
 * document in one query.
 */
class DiscussionHasPollQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    /**
     * More discussions than the repeated-query detector's threshold (5), so a
     * per-discussion query cannot hide under it.
     */
    private const DISCUSSION_COUNT = 8;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $date = '2021-01-01 00:00:00';
        $discussions = [];
        $posts = [];
        $polls = [];

        for ($id = 1; $id <= self::DISCUSSION_COUNT; $id++) {
            $discussions[] = ['id' => $id, 'title' => "Discussion $id", 'comment_count' => 2, 'participant_count' => 2, 'created_at' => $date, 'user_id' => 1, 'first_post_id' => 100 + $id];
            $posts[] = ['id' => 100 + $id, 'user_id' => 1, 'discussion_id' => $id, 'number' => 1, 'created_at' => $date, 'content' => "<t><p>Post in $id</p></t>", 'type' => 'comment'];
            // The profile lists the normal user's replies, which carry no polls
            // of their own: only the discussions' first posts do.
            $posts[] = ['id' => 200 + $id, 'user_id' => 2, 'discussion_id' => $id, 'number' => 2, 'created_at' => $date, 'content' => "<t><p>Reply in $id</p></t>", 'type' => 'comment'];

            // Odd discussions have a poll; even ones have none.
            if ($id % 2) {
                $polls[] = ['id' => $id, 'question' => "Poll $id", 'post_id' => 100 + $id, 'user_id' => 1];
            }
        }

        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Discussion::class => $discussions,
            Post::class       => $posts,
            Poll::class       => $polls,
        ]);
    }

    private function listNormalUsersPosts(): array
    {
        $response = $this->send(
            $this->request('GET', '/api/posts', ['authenticatedAs' => 1])
                ->withQueryParams(['filter' => ['author' => 'normal', 'type' => 'comment'], 'sort' => '-createdAt'])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        return json_decode((string) $response->getBody(), true);
    }

    /**
     * The SQL of every query run by $callback whose top-level FROM is the
     * polls table. Queries on other tables that merely mention polls in a
     * subquery don't count.
     *
     * @return string[]
     */
    private function pollQueriesDuring(callable $callback): array
    {
        // Boot the app and populate the database before we start counting.
        $this->app();

        $db = $this->database();
        $db->enableQueryLog();

        $callback();

        $queries = array_column($db->getQueryLog(), 'query');

        $db->disableQueryLog();

        return array_values(array_filter(
            $queries,
            fn (string $sql) => preg_match('/^select\b.*?\bfrom\s+[`"]?(\w+)/is', $sql, $matches) && $matches[1] === 'polls'
        ));
    }

    #[Test]
    public function has_poll_is_not_queried_once_per_discussion()
    {
        $pollQueries = $this->pollQueriesDuring(function () {
            $this->listNormalUsersPosts();
        });

        // One batched load for the posts' own `polls` include, and one for
        // every discussion's hasPoll.
        $this->assertLessThanOrEqual(
            2,
            count($pollQueries),
            'The polls table was queried '.count($pollQueries).' times for '.self::DISCUSSION_COUNT." discussions:\n".implode("\n", $pollQueries)
        );
    }

    #[Test]
    public function has_poll_is_correct_for_each_discussion_included_with_posts()
    {
        $hasPoll = [];

        foreach ($this->listNormalUsersPosts()['included'] ?? [] as $resource) {
            if ($resource['type'] === 'discussions') {
                $hasPoll[(int) $resource['id']] = $resource['attributes']['hasPoll'];
            }
        }

        ksort($hasPoll);

        $expected = [];

        for ($id = 1; $id <= self::DISCUSSION_COUNT; $id++) {
            $expected[$id] = (bool) ($id % 2);
        }

        $this->assertSame($expected, $hasPoll);
    }
}
