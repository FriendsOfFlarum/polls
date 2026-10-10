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
use Flarum\Api\Resource\EloquentBuffer;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * Every poll include path, on every endpoint that serializes polls, must cost
 * the same with one poll as with eight: posts, the discussion list, a
 * discussion whose first post has several polls, the poll list, poll groups
 * and a group holding several polls. Run as an admin, a member and a guest,
 * with public and private polls.
 *
 * Each request is measured with eight polls per list, the extra rows are
 * deleted, and the same request must then run exactly as many queries. Total
 * queries, not only those on poll tables: a user or group loaded per poll
 * counts too, wherever it comes from.
 */
class IncludePathsQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const ROUNDS = 8;

    private const PATHS = ['', 'options', 'votes', 'votes.option', 'votes.user', 'votes.user.groups', 'votes.poll', 'myVotes', 'myVotes.option', 'myVotes.user', 'myVotes.user.groups', 'myVotes.poll', 'user', 'user.groups', 'post', 'post.discussion', 'pollGroup'];

    /** A poll group's own owner, on the group endpoints: label => [path, include] */
    private const GROUP_OWNER = [
        'groups' => ['/api/poll_groups', 'user,user.groups,polls'],
        'group'  => ['/api/poll_groups/1', 'user,user.groups,polls'],
    ];

    /** endpoint => [path, query, where its polls are included] */
    private const ENDPOINTS = [
        'posts'       => ['/api/posts', ['filter' => ['author' => 'normal']], 'polls'],
        'discussions' => ['/api/discussions', [], 'firstPost.polls'],
        'discussion'  => ['/api/discussions/1', [], 'firstPost.polls'],
        'polls'       => ['/api/polls', [], ''],
        'groups'      => ['/api/poll_groups', [], 'polls'],
        'group'       => ['/api/poll_groups/1', [], 'polls'],
    ];

    public static function visibility(): array
    {
        return ['public polls' => [true], 'private polls' => [false]];
    }

    /**
     * Round 1 creates one of everything; each later round adds a discussion
     * with a poll, a global poll, a group with a poll, a second poll on the
     * first discussion's post and a second poll in the first group. So every
     * endpoint above lists one poll more per round.
     */
    private function seed(bool $public): void
    {
        $this->extension('fof-polls');
        $this->setting('fof-polls.enableGlobalPolls', true);
        $this->setting('fof-polls.enablePollGroups', true);

        $settings = json_encode(['max_votes' => 0, 'hide_votes' => false, 'public_poll' => $public, 'allow_change_vote' => false, 'allow_multiple_votes' => false]);
        $date = '2021-01-01 00:00:00';
        $rows = ['discussions' => [], 'posts' => [], 'groups' => [], 'polls' => [], 'options' => [], 'votes' => [], 'users' => [], 'memberships' => []];

        $addPoll = function (?int $postId, ?int $groupId) use (&$rows, $settings, $date) {
            $id = 1000 + count($rows['polls']) + 1;

            /*
             * Every poll has its OWN author and its own extra voter, each in a
             * group. Shared users keep the number of distinct users flat as
             * polls are added, which hides anything loaded per user.
             */
            $author = 10 + 2 * ($id - 1000);
            $voter = $author + 1;
            foreach ([$author, $voter] as $userId) {
                $rows['users'][] = ['id' => $userId, 'username' => "user$userId", 'email' => "user$userId@machine.local", 'is_email_confirmed' => 1];
                $rows['memberships'][] = ['user_id' => $userId, 'group_id' => 4];
            }

            $rows['polls'][] = ['id' => $id, 'question' => "Poll $id", 'post_id' => $postId, 'poll_group_id' => $groupId, 'user_id' => $author, 'end_date' => null, 'created_at' => $date, 'updated_at' => $date, 'vote_count' => 3, 'published_at' => $date, 'settings' => $settings];

            foreach (['Yes', 'No'] as $n => $answer) {
                $rows['options'][] = ['id' => $id * 10 + $n, 'answer' => $answer, 'poll_id' => $id, 'vote_count' => 0, 'created_at' => $date, 'updated_at' => $date];
            }

            // The admin, the member and the poll's own voter each voted, so
            // every actor's myVotes has something in it.
            foreach ([1, 2, $voter] as $n => $userId) {
                $rows['votes'][] = ['id' => $id * 10 + $n, 'poll_id' => $id, 'option_id' => $id * 10 + ($n % 2), 'user_id' => $userId, 'created_at' => $date, 'updated_at' => $date];
            }
        };

        for ($round = 1; $round <= self::ROUNDS; $round++) {
            $rows['discussions'][] = ['id' => $round, 'title' => "Discussion $round", 'created_at' => Carbon::parse($date), 'last_posted_at' => Carbon::parse($date), 'user_id' => 2, 'first_post_id' => 100 + $round, 'comment_count' => 1];
            $rows['posts'][] = ['id' => 100 + $round, 'number' => 1, 'discussion_id' => $round, 'created_at' => Carbon::parse($date), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>Post</p></t>'];
            // Each poll group has its own owner too.
            $owner = 5000 + $round;
            $rows['users'][] = ['id' => $owner, 'username' => "owner$owner", 'email' => "owner$owner@machine.local", 'is_email_confirmed' => 1];
            $rows['memberships'][] = ['user_id' => $owner, 'group_id' => 4];
            $rows['groups'][] = ['id' => $round, 'name' => "Group $round", 'user_id' => $owner, 'created_at' => $date, 'updated_at' => $date];

            $addPoll(100 + $round, null);
            $addPoll(null, null);
            $addPoll(null, $round);

            if ($round > 1) {
                $addPoll(101, null);
                $addPoll(null, 1);
            }
        }

        $this->prepareDatabase([
            User::class        => array_merge([$this->normalUser()], $rows['users']),
            'group_user'       => $rows['memberships'],
            Discussion::class  => $rows['discussions'],
            Post::class        => $rows['posts'],
            'poll_groups'      => $rows['groups'],
            'polls'            => $rows['polls'],
            'poll_options'     => $rows['options'],
            'poll_votes'       => $rows['votes'],
            'group_permission' => [['permission' => 'viewPollGroups', 'group_id' => 2], ['permission' => 'viewPollGroups', 'group_id' => 3]],
        ]);
    }

    /** Leave only round 1: one discussion, one global poll, one group, one poll on each. */
    private function deleteAllButTheFirstRound(): void
    {
        $db = $this->database();
        $keep = [1001, 1002, 1003];

        $db->table('poll_votes')->whereNotIn('poll_id', $keep)->delete();
        $db->table('poll_options')->whereNotIn('poll_id', $keep)->delete();
        $db->table('polls')->whereNotIn('id', $keep)->delete();
        $db->table('discussions')->where('id', '>', 1)->delete();
        $db->table('posts')->where('id', '>', 101)->delete();
        $db->table('poll_groups')->where('id', '>', 1)->delete();
    }

    /** @return array{0: array, 1: int} the document, and how many queries it took */
    private function measure(string $path, array $query, ?int $actor): array
    {
        $this->app();
        $db = $this->database();

        // Core's include buffer is static: models a request queued and never
        // loaded stay queued for the next one. Each real request is a fresh
        // process; hundreds in one test are not, so start each one empty.
        (new \ReflectionProperty(EloquentBuffer::class, 'buffer'))->setValue(null, []);

        $db->enableQueryLog();
        $db->flushQueryLog();

        $response = $this->send($this->request('GET', $path, $actor ? ['authenticatedAs' => $actor] : [])->withQueryParams($query));
        $count = count($db->getQueryLog());
        $db->flushQueryLog();

        return [[$response->getStatusCode(), json_decode((string) $response->getBody(), true)], $count];
    }

    /**
     * One request per actor first, so work done once per process or per
     * visit (asset revisions, the actor's last-seen time) lands on neither
     * measurement.
     */
    private function warmUp(): void
    {
        foreach ([1, 2, 0] as $actor) {
            $this->measure('/api', [], $actor);
        }
    }

    /** @return array<string, array{0: int, 1: string, 2: array}> label => [actor, path, query] */
    private function requests(): array
    {
        $requests = [];

        foreach ([1 => 'the admin', 2 => 'a member', 0 => 'a guest'] as $actor => $who) {
            foreach (self::ENDPOINTS as $name => [$path, $query, $prefix]) {
                foreach (self::PATHS as $relation) {
                    $chain = trim($prefix.'.'.$relation, '.');
                    $include = [];
                    $parts = $chain === '' ? [] : explode('.', $chain);

                    foreach (array_keys($parts) as $i) {
                        $include[] = implode('.', array_slice($parts, 0, $i + 1));
                    }

                    if (str_starts_with($chain, 'firstPost.')) {
                        array_unshift($include, 'firstPost');
                    }

                    $label = "$who on $name with ".($chain ?: 'no include');
                    $requests[$label] = [$actor, $path, $query + ($include ? ['include' => implode(',', array_unique($include))] : [])];
                }
            }

            foreach (self::GROUP_OWNER as $name => [$path, $include]) {
                $requests["$who on $name with its owner"] = [$actor, $path, ['include' => $include]];
            }
        }

        return $requests;
    }

    #[Test]
    #[DataProvider('visibility')]
    public function no_include_path_costs_queries_per_poll(bool $public): void
    {
        $this->seed($public);

        $many = [];
        $this->warmUp();

        foreach ($this->requests() as $label => [$actor, $path, $query]) {
            [[$status, $body], $count] = $this->measure($path, $query, $actor);
            $this->assertSame(200, $status, $label);

            $primary = isset($body['data']['type']) ? [$body['data']] : ($body['data'] ?? []);
            $polls = array_filter(array_merge($primary, $body['included'] ?? []), fn ($r) => ($r['type'] ?? null) === 'polls');
            $this->assertGreaterThanOrEqual(self::ROUNDS, count($polls), "Every poll is in the response: $label");

            // A private poll's voters are for its author and moderators, not a member or a guest.
            if (!$public && $actor !== 1) {
                foreach ($polls as $poll) {
                    $this->assertArrayNotHasKey('votes', $poll['relationships'] ?? [], "Private voters stay hidden: $label");
                }
            }

            $many[$label] = $count;
        }

        $this->deleteAllButTheFirstRound();
        $this->warmUp();

        foreach ($this->requests() as $label => [$actor, $path, $query]) {
            [[$status], $count] = $this->measure($path, $query, $actor);
            $this->assertSame(200, $status, $label);
            $this->assertSame($count, $many[$label], "Eight polls cost the same queries as one: $label");
        }
    }
}
