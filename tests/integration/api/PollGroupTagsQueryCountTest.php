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
use FoF\Polls\Tests\integration\InspectsQueries;
use PHPUnit\Framework\Attributes\Test;

/**
 * With flarum/tags enabled, every permission check on a discussion reads the
 * discussion's tags. A poll group can hold discussion polls, and the poll
 * policies check each one's discussion, so the group endpoints must load those
 * tags for the whole page rather than once per discussion.
 *
 * Each request is measured with eight discussion polls in the group, then
 * with one, and must cost the same.
 */
class PollGroupTagsQueryCountTest extends TestCase
{
    use InspectsQueries;
    use RetrievesAuthorizedUsers;

    private const POLLS = 8;

    /** label => [path, query] */
    private const REQUESTS = [
        'the group'      => ['/api/poll_groups/1', []],
        'the group list' => ['/api/poll_groups', []],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-tags', 'fof-polls');
        $this->setting('fof-polls.enablePollGroups', true);

        $date = '2021-01-01 00:00:00';
        $rows = ['discussions' => [], 'posts' => [], 'tags' => [], 'discussion_tag' => [], 'polls' => [], 'poll_options' => []];

        // Each discussion has its own tag and a poll in group 1.
        for ($id = 1; $id <= self::POLLS; $id++) {
            $rows['discussions'][] = ['id' => $id, 'title' => "Discussion $id", 'created_at' => Carbon::parse($date), 'last_posted_at' => Carbon::parse($date), 'user_id' => 1, 'first_post_id' => 100 + $id, 'comment_count' => 1];
            $rows['posts'][] = ['id' => 100 + $id, 'number' => 1, 'discussion_id' => $id, 'created_at' => Carbon::parse($date), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>Post</p></t>'];
            $rows['tags'][] = ['id' => $id, 'name' => "Tag $id", 'slug' => "tag-$id", 'position' => $id];
            $rows['discussion_tag'][] = ['discussion_id' => $id, 'tag_id' => $id];
            $rows['polls'][] = ['id' => $id, 'question' => "Poll $id", 'post_id' => 100 + $id, 'poll_group_id' => 1, 'user_id' => 1, 'created_at' => $date, 'updated_at' => $date, 'published_at' => $date, 'settings' => '{}'];
            $rows['poll_options'][] = ['id' => $id * 10, 'answer' => 'Yes', 'poll_id' => $id, 'created_at' => $date, 'updated_at' => $date];
            $rows['poll_options'][] = ['id' => $id * 10 + 1, 'answer' => 'No', 'poll_id' => $id, 'created_at' => $date, 'updated_at' => $date];
        }

        $this->prepareDatabase([
            User::class        => [$this->normalUser()],
            Discussion::class  => $rows['discussions'],
            Post::class        => $rows['posts'],
            'tags'             => $rows['tags'],
            'discussion_tag'   => $rows['discussion_tag'],
            'poll_groups'      => [['id' => 1, 'name' => 'Group', 'user_id' => 1, 'created_at' => $date, 'updated_at' => $date]],
            'polls'            => $rows['polls'],
            'poll_options'     => $rows['poll_options'],
            'group_permission' => [
                ['permission' => 'viewPollGroups', 'group_id' => 2],
                ['permission' => 'viewPollGroups', 'group_id' => 3],
                ['permission' => 'discussion.polls.vote', 'group_id' => 3],
            ],
        ]);
    }

    /** @return array{0: int, 1: string[], 2: int} status, the queries on the tags table, all queries */
    private function measure(string $path, array $query, ?int $actor): array
    {
        // Core's include buffer is static (flarum/framework#5160): start each
        // request in this one process empty, as a real request would.
        (new \ReflectionProperty(EloquentBuffer::class, 'buffer'))->setValue(null, []);

        $status = 0;
        $queries = $this->queriesDuring(function () use ($path, $query, $actor, &$status) {
            $status = $this->send($this->request('GET', $path, $actor ? ['authenticatedAs' => $actor] : [])->withQueryParams($query))->getStatusCode();
        });

        return [$status, array_values(array_filter($queries, fn (string $sql) => $this->selectsFrom($sql) === 'tags')), count($queries)];
    }

    /** @return array<string, array{0: int, 1: string[], 2: int}> label => measurement */
    private function measureAll(): array
    {
        $results = [];

        foreach ([1 => 'the admin', 2 => 'a member', 0 => 'a guest'] as $actor => $who) {
            // Work done once per visit (the actor's last-seen time) lands on
            // neither measurement.
            $this->measure('/api', [], $actor);

            foreach (self::REQUESTS as $name => [$path, $query]) {
                $results["$who on $name"] = $this->measure($path, $query, $actor);
            }
        }

        return $results;
    }

    /**
     * This test compares every request with eight polls and with one, and
     * reports all of them at once. The repeated-query detector would stop at
     * the first.
     */
    protected function detectsRepeatedQueries(): bool
    {
        return false;
    }

    #[Test]
    public function a_group_of_discussion_polls_loads_their_tags_for_the_whole_page()
    {
        $many = $this->measureAll();

        $db = $this->database();
        $db->table('poll_options')->where('poll_id', '>', 1)->delete();
        $db->table('polls')->where('id', '>', 1)->delete();

        $one = $this->measureAll();

        $grows = [];

        foreach ($many as $label => [$status, $tagQueries, $total]) {
            $this->assertSame(200, $status, $label);
            $this->assertSame(200, $one[$label][0], $label);

            if (count($tagQueries) !== count($one[$label][1]) || $total !== $one[$label][2]) {
                $grows[] = sprintf('%s: %d queries for %d polls, %d for one; the tags table %d times, %d for one', $label, $total, self::POLLS, $one[$label][2], count($tagQueries), count($one[$label][1]));
            }
        }

        $this->assertSame([], $grows, "Requests that cost more with more polls:\n".implode("\n", $grows)."\n\nTags queries for ".self::POLLS.' polls, '.array_key_first($many).":\n".implode("\n", reset($many)[1]));
    }
}
