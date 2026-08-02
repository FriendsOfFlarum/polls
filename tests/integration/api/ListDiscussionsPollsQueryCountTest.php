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

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

/**
 * Regression test for the N+1 polls queries on the discussion list described in
 * https://github.com/FriendsOfFlarum/polls/issues/124.
 *
 * The discussion index serializes `firstPost.polls`. Before the fix each
 * discussion's first-post polls were resolved with an individual query, so the
 * query count grew linearly with the number of discussions in the payload.
 * After the fix the polls must be resolved in a single batched query (or none
 * at all when the include is not requested).
 */
class ListDiscussionsPollsQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    /**
     * Number of discussions (each with its own first-post poll) in the payload.
     * Deliberately large so an N+1 produces many more `polls` queries than a
     * single batched load.
     */
    private const DISCUSSION_COUNT = 8;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $discussions = [];
        $posts = [];
        $polls = [];
        $pollOptions = [];

        for ($i = 0; $i < self::DISCUSSION_COUNT; $i++) {
            $discussionId = $i + 1;
            $postId = 100 + $i;
            $pollId = 200 + $i;

            $discussions[] = [
                'id'              => $discussionId,
                'title'           => __CLASS__.' '.$discussionId,
                'created_at'      => Carbon::parse('2021-01-01 00:00:00'),
                'last_posted_at'  => Carbon::parse('2021-01-01 00:00:00'),
                'user_id'         => 1,
                'first_post_id'   => $postId,
                'comment_count'   => 1,
            ];
            $posts[] = [
                'id'            => $postId,
                'number'        => 1,
                'discussion_id' => $discussionId,
                'created_at'    => Carbon::parse('2021-01-01 00:00:00'),
                'user_id'       => 1,
                'type'          => 'comment',
                'content'       => '<t><p>post in '.$discussionId.'</p></t>',
            ];
            $polls[] = [
                'id'           => $pollId,
                'question'     => 'Poll '.$pollId,
                'post_id'      => $postId,
                'user_id'      => 1,
                'end_date'     => null,
                'created_at'   => '2021-01-01 00:00:00',
                'updated_at'   => '2021-01-01 00:00:00',
                'vote_count'   => 0,
                'published_at' => '2021-01-01 00:00:00',
                'settings'     => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}',
            ];
            $pollOptions[] = ['id' => $pollId * 10, 'answer' => 'Yes', 'poll_id' => $pollId, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'];
            $pollOptions[] = ['id' => $pollId * 10 + 1, 'answer' => 'No', 'poll_id' => $pollId, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'];
        }

        $this->prepareDatabase([
            Discussion::class => $discussions,
            Post::class       => $posts,
            User::class       => [$this->normalUser()],
            'polls'           => $polls,
            'poll_options'    => $pollOptions,
        ]);
    }

    private function listDiscussions(array $queryParams = []): array
    {
        $request = $this->request('GET', '/api/discussions', ['authenticatedAs' => 1]);

        if (!empty($queryParams)) {
            $request = $request->withQueryParams($queryParams);
        }

        $response = $this->send($request);

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Count the top-level SELECT queries issued against the `polls` table.
     *
     * An eager-load of `firstPost.polls` for the whole page should be a single
     * query (`where post_id in (100, 101, ...)`). An N+1 issues one such query
     * per discussion — each with a single-element `in (...)` — so counting the
     * number of poll SELECTs, rather than inspecting the `in (...)` shape, is
     * what distinguishes a batch load from the regression.
     */
    private function countPollSelectQueries(callable $callback): int
    {
        // Boot the app and populate the database before we start counting.
        $this->app();

        $db = $this->database();
        $db->flushQueryLog();
        $db->enableQueryLog();

        $callback();

        $pollSelects = 0;

        foreach ($db->getQueryLog() as $query) {
            // Only count top-level SELECTs whose FROM clause is the polls table
            // (subquery references like "from \"posts\"" that merely mention
            // polls in a WHERE exists(...) are ignored).
            if (stripos($query['query'], 'select * from "polls"') === 0
                || stripos($query['query'], 'select * from `polls`') === 0) {
                $pollSelects++;
            }
        }

        $db->disableQueryLog();

        return $pollSelects;
    }

    #[Test]
    public function first_post_polls_are_not_loaded_individually_per_discussion()
    {
        $pollSelects = $this->countPollSelectQueries(function () {
            $this->listDiscussions();
        });

        // With DISCUSSION_COUNT discussions, an N+1 issues one poll SELECT per
        // discussion. A correct batched eager-load issues at most a couple
        // (e.g. one for the Discussion.polls `hasPoll` check + one batched
        // firstPost.polls load). Anything approaching DISCUSSION_COUNT means the
        // regression from issue #124 is present.
        $this->assertLessThan(
            self::DISCUSSION_COUNT,
            $pollSelects,
            "The polls table was queried $pollSelects times for ".self::DISCUSSION_COUNT
            .' discussions — this is the per-discussion N+1 from issue #124. Poll loads must be batched.'
        );
    }

    #[Test]
    public function discussion_list_still_reports_has_poll()
    {
        $data = $this->listDiscussions();

        $this->assertNotEmpty($data['data']);

        foreach ($data['data'] as $discussion) {
            $this->assertTrue(
                $discussion['attributes']['hasPoll'],
                'Every discussion in the fixture has a poll on its first post, so hasPoll must be true.'
            );
        }
    }

    #[Test]
    public function the_discussion_list_serializes_no_posts_or_polls_by_default()
    {
        // The list UI reads exactly one thing from this extension: the
        // hasPoll attribute, powered by a narrow eager load. Default-including
        // firstPost.polls forced every first post to be fully serialized
        // (rendered HTML, per-post policies) and ran every poll's policy
        // attributes — which lazily fetched one post per poll.
        $data = $this->listDiscussions();

        $included = $data['included'] ?? [];

        $this->assertCount(0, array_filter($included, fn ($resource) => $resource['type'] === 'posts'), 'No posts in the default list payload.');
        $this->assertCount(0, array_filter($included, fn ($resource) => $resource['type'] === 'polls'), 'No polls in the default list payload.');
    }

    #[Test]
    public function explicitly_including_first_post_polls_serializes_complete_polls()
    {
        $data = $this->listDiscussions(['include' => 'firstPost,firstPost.polls']);

        $included = $data['included'] ?? [];
        $polls = array_values(array_filter($included, fn ($resource) => $resource['type'] === 'polls'));

        $includedPollIds = array_column($polls, 'id');

        for ($i = 0; $i < self::DISCUSSION_COUNT; $i++) {
            $this->assertContains(
                (string) (200 + $i),
                $includedPollIds,
                'Poll '.(200 + $i).' should be included when explicitly requested.'
            );
        }

        // The narrow hasPoll eager load (id, post_id only) must not leak into
        // serialization: explicitly requested polls carry their real data.
        foreach ($polls as $poll) {
            $this->assertNotNull($poll['attributes']['question'] ?? null, "Poll {$poll['id']} serialized without its question — a narrow eager load leaked into the include.");
        }
    }
}
