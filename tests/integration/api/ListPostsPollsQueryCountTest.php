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
 * A list of posts from different discussions — a user's posts, search — must
 * not cost queries per poll or per discussion, and the viewer's own votes must
 * be the ones loaded.
 */
class ListPostsPollsQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const DISCUSSIONS = 8;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $discussions = $posts = $polls = $options = $votes = [];

        for ($i = 1; $i <= self::DISCUSSIONS; $i++) {
            $postId = 100 + $i;
            $pollId = 200 + $i;
            $discussions[] = ['id' => $i, 'title' => "Discussion $i", 'created_at' => Carbon::parse('2021-01-01'), 'last_posted_at' => Carbon::parse('2021-01-01'), 'user_id' => 2, 'first_post_id' => $postId, 'comment_count' => 1];
            $posts[] = ['id' => $postId, 'number' => 1, 'discussion_id' => $i, 'created_at' => Carbon::parse('2021-01-01'), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>Post '.$i.'</p></t>'];
            $polls[] = ['id' => $pollId, 'question' => "Poll $i", 'post_id' => $postId, 'user_id' => 2, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 1, 'published_at' => '2021-01-01 00:00:00', 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'];
            $options[] = ['id' => $pollId * 10, 'answer' => 'Yes', 'poll_id' => $pollId, 'vote_count' => 1, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'];
            $options[] = ['id' => $pollId * 10 + 1, 'answer' => 'No', 'poll_id' => $pollId, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'];
            // The normal user (2) voted Yes in every poll, user 3 voted No.
            $votes[] = ['id' => $pollId, 'poll_id' => $pollId, 'option_id' => $pollId * 10, 'user_id' => 2, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'];
            $votes[] = ['id' => $pollId + 1000, 'poll_id' => $pollId, 'option_id' => $pollId * 10 + 1, 'user_id' => 3, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'];
        }

        // And one discussion with no poll, so hasPoll has a false to report.
        $discussions[] = ['id' => 99, 'title' => 'No poll', 'created_at' => Carbon::parse('2021-01-01'), 'last_posted_at' => Carbon::parse('2021-01-01'), 'user_id' => 3, 'first_post_id' => 199, 'comment_count' => 1];
        $posts[] = ['id' => 199, 'number' => 1, 'discussion_id' => 99, 'created_at' => Carbon::parse('2021-01-01'), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>No poll</p></t>'];

        $this->prepareDatabase([
            User::class       => [$this->normalUser(), ['id' => 3, 'username' => 'other', 'email' => 'other@machine.local', 'is_email_confirmed' => 1]],
            Discussion::class => $discussions,
            Post::class       => $posts,
            'polls'           => $polls,
            'poll_options'    => $options,
            'poll_votes'      => $votes,
        ]);
    }

    /** @return array{0: array, 1: string[]} the document, and the SQL it took */
    private function get(string $path, array $query, ?int $actor = 2): array
    {
        $this->app();
        $db = $this->database();
        $db->enableQueryLog();
        $db->flushQueryLog();

        $response = $this->send($this->request('GET', $path, $actor ? ['authenticatedAs' => $actor] : [])->withQueryParams($query));

        $sql = array_column($db->getQueryLog(), 'query');
        $db->flushQueryLog();

        $this->assertEquals(200, $response->getStatusCode());

        return [json_decode($response->getBody()->getContents(), true), $sql];
    }

    private function countMatching(array $sql, string $pattern): int
    {
        // Without the table prefix (CI runs with one), or `from polls` matches nothing and passes for nothing.
        $prefix = $this->database()->getTablePrefix();

        return count(array_filter($sql, fn (string $q) => (bool) preg_match($pattern, str_replace(['`', '"', $prefix ?: "\0"], '', $q))));
    }

    #[Test]
    public function a_list_of_posts_from_different_discussions_loads_its_polls_in_batches()
    {
        [$body, $sql] = $this->get('/api/posts', ['filter' => ['author' => 'normal']]);

        $this->assertCount(self::DISCUSSIONS, $body['data']);

        $this->assertSame(0, $this->countMatching($sql, '/select exists\(select \* from polls/'), 'hasPoll does not run an exists() per discussion');
        $this->assertLessThanOrEqual(1, $this->countMatching($sql, '/from poll_votes/'), "The viewer's votes load in one query");
        $this->assertSame(0, $this->countMatching($sql, '/from discussions where discussions\.id = \?/'), 'No discussion is fetched per poll');
    }

    #[Test]
    public function the_viewers_own_votes_are_the_ones_loaded()
    {
        // Two voters on different options: each viewer must get their own vote
        // back, and a guest none. Run in turn, as a long-running process would.
        // [viewer, offset from the poll id to their vote id]
        foreach ([[2, 0], [3, 1000], [null, null], [2, 0]] as [$actor, $offset]) {
            $who = $actor ? "user $actor" : 'a guest';
            [$posts] = $this->get('/api/posts', ['filter' => ['author' => 'normal'], 'include' => 'polls,polls.myVotes'], $actor);
            [$discussions] = $this->get('/api/discussions', ['include' => 'firstPost,firstPost.polls,firstPost.polls.myVotes'], $actor);

            foreach (['the posts list' => $posts, 'the discussion list' => $discussions] as $where => $body) {
                $polls = array_filter($body['included'] ?? [], fn ($r) => $r['type'] === 'polls');
                $this->assertCount(self::DISCUSSIONS, $polls, "Every poll is included on $where for $who");

                foreach ($polls as $poll) {
                    $expected = $offset === null ? [] : [(string) ((int) $poll['id'] + $offset)];
                    $this->assertSame($expected, array_column($poll['relationships']['myVotes']['data'] ?? [], 'id'), "On $where, $who sees their own vote only");
                }
            }
        }
    }

    #[Test]
    public function including_first_posts_without_their_polls_loads_no_polls()
    {
        [$body, $sql] = $this->get('/api/discussions', ['include' => 'firstPost']);

        $this->assertCount(self::DISCUSSIONS + 1, $body['data']);
        $this->assertSame(0, $this->countMatching($sql, '/from poll_options/'), 'No options load for polls nobody asked for');
        $this->assertSame(0, $this->countMatching($sql, '/from poll_votes/'), 'No votes load for polls nobody asked for');
    }

    #[Test]
    public function no_poll_is_fetched_again_for_its_options_or_votes()
    {
        // Options and votes reached through their poll, or an option through a
        // vote, must find that poll in memory: a `polls.id = ?` query is one
        // poll fetched per option or vote.
        $requests = [
            'the posts list'           => ['/api/posts', ['filter' => ['author' => 'normal']]],
            'the discussion list'      => ['/api/discussions', ['include' => 'firstPost,firstPost.polls,firstPost.polls.options,firstPost.polls.myVotes,firstPost.polls.myVotes.option']],
            'a discussion'             => ['/api/discussions/1', []],
            'a poll'                   => ['/api/polls/201', []],
            'a poll with every voter'  => ['/api/polls/201', ['include' => 'options,votes,votes.option,myVotes,myVotes.option']],
        ];

        foreach ($requests as $where => [$path, $query]) {
            [, $sql] = $this->get($path, $query, 1);

            $this->assertSame(0, $this->countMatching($sql, '/from polls where polls\.id = \?/'), "No poll is fetched per option or vote on $where");
            // Bindings may be inlined (`in (2080)`), so count the queries, not their shape.
            $this->assertLessThanOrEqual(2, $this->countMatching($sql, '/from poll_options/'), "Options load in batches, not per poll, on $where");
            $this->assertLessThanOrEqual(2, $this->countMatching($sql, '/from poll_votes/'), "Votes load in batches, not per poll, on $where");
            // A single poll fetches its one post; a list must not fetch one per poll.
            if (!str_starts_with($path, '/api/polls/')) {
                $this->assertSame(0, $this->countMatching($sql, '/from posts where posts\.id = \?/'), "No post is fetched per poll on $where");
            }
        }
    }

    #[Test]
    public function the_poll_endpoints_return_the_viewers_own_votes()
    {
        foreach ([[2, 0], [3, 1000], [null, null]] as [$actor, $offset]) {
            [$body] = $this->get('/api/polls/201', [], $actor);

            $expected = $offset === null ? [] : [(string) (201 + $offset)];
            $this->assertSame($expected, array_column($body['data']['relationships']['myVotes']['data'] ?? [], 'id'), 'The poll endpoint shows '.($actor ? "user $actor" : 'a guest').' their own vote only');
        }
    }

    #[Test]
    public function has_poll_is_answered_for_every_discussion_in_one_query()
    {
        [$body, $sql] = $this->get('/api/discussions', []);

        $hasPoll = array_column(array_map(fn ($d) => ['id' => $d['id'], 'v' => $d['attributes']['hasPoll']], $body['data']), 'v', 'id');

        $this->assertCount(self::DISCUSSIONS + 1, $hasPoll);
        $this->assertFalse($hasPoll['99'], 'A discussion without a poll says so');
        $this->assertSame(self::DISCUSSIONS, count(array_filter($hasPoll)), 'Every discussion with a poll says so');
        $this->assertSame(1, $this->countMatching($sql, '/from polls/'), 'One query answers hasPoll for the whole page');
        $this->assertSame(0, $this->countMatching($sql, '/select \* from polls/'), 'hasPoll loads no poll rows');
    }

    #[Test]
    public function every_voter_and_their_options_load_in_batches_across_a_list()
    {
        // Public polls show their voters. Including `votes` and `votes.option`
        // on a list must cost the same with eight polls as with one.
        $this->database()->table('polls')->update(['settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": true,"allow_change_vote": false,"allow_multiple_votes": false}']);

        $requests = [
            'the posts list'      => ['/api/posts', ['filter' => ['author' => 'normal'], 'include' => 'polls,polls.votes,polls.votes.option']],
            'the discussion list' => ['/api/discussions', ['include' => 'firstPost,firstPost.polls,firstPost.polls.votes,firstPost.polls.votes.option']],
        ];

        foreach ($requests as $where => [$path, $query]) {
            [$body, $sql] = $this->get($path, $query);

            $votes = array_filter($body['included'] ?? [], fn ($r) => $r['type'] === 'poll_votes');

            $this->assertCount(self::DISCUSSIONS * 2, $votes, "Every vote of every public poll is included on $where");

            // One query for the viewer's own votes, one for every vote, one for the voted options.
            $this->assertSame(2, $this->countMatching($sql, '/from poll_votes/'), "Votes load in batches, not per poll, on $where");
            $this->assertSame(1, $this->countMatching($sql, '/from poll_options/'), "Voted options load in one query, not per poll, on $where");
            $this->assertSame(0, $this->countMatching($sql, '/from polls where polls\.id = \?/'), "No poll is fetched per vote on $where");
        }
    }
}
