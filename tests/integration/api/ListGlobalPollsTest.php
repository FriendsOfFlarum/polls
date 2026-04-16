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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

class ListGlobalPollsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->setting('fof-polls.enableGlobalPolls', true);

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
            ],
            'polls' => [
                // Poll 1: Active — no end date (perpetual)
                ['id' => 1, 'question' => 'Active poll no end', 'subtitle' => null, 'image' => null, 'image_alt' => null, 'post_id' => null, 'user_id' => 1, 'end_date' => null, 'created_at' => '2025-01-01 00:00:00', 'updated_at' => '2025-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
                // Poll 2: Active — end date in the future
                ['id' => 2, 'question' => 'Active poll future end', 'subtitle' => null, 'image' => null, 'image_alt' => null, 'post_id' => null, 'user_id' => 1, 'end_date' => '2030-01-01 00:00:00', 'created_at' => '2025-01-02 00:00:00', 'updated_at' => '2025-01-02 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
                // Poll 3: Ended — end date in the past
                ['id' => 3, 'question' => 'Ended poll old', 'subtitle' => null, 'image' => null, 'image_alt' => null, 'post_id' => null, 'user_id' => 1, 'end_date' => '2020-01-01 00:00:00', 'created_at' => '2025-01-03 00:00:00', 'updated_at' => '2025-01-03 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
                // Poll 4: Ended — end date in the past (more recent)
                ['id' => 4, 'question' => 'Ended poll recent', 'subtitle' => null, 'image' => null, 'image_alt' => null, 'post_id' => null, 'user_id' => 1, 'end_date' => '2021-06-01 00:00:00', 'created_at' => '2025-01-04 00:00:00', 'updated_at' => '2025-01-04 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Yes', 'poll_id' => 1, 'vote_count' => 0, 'created_at' => '2025-01-01 00:00:00', 'updated_at' => '2025-01-01 00:00:00'],
                ['id' => 2, 'answer' => 'No', 'poll_id' => 1, 'vote_count' => 0, 'created_at' => '2025-01-01 00:00:00', 'updated_at' => '2025-01-01 00:00:00'],
                ['id' => 3, 'answer' => 'Yes', 'poll_id' => 2, 'vote_count' => 0, 'created_at' => '2025-01-02 00:00:00', 'updated_at' => '2025-01-02 00:00:00'],
                ['id' => 4, 'answer' => 'No', 'poll_id' => 2, 'vote_count' => 0, 'created_at' => '2025-01-02 00:00:00', 'updated_at' => '2025-01-02 00:00:00'],
                ['id' => 5, 'answer' => 'Yes', 'poll_id' => 3, 'vote_count' => 0, 'created_at' => '2025-01-03 00:00:00', 'updated_at' => '2025-01-03 00:00:00'],
                ['id' => 6, 'answer' => 'No', 'poll_id' => 3, 'vote_count' => 0, 'created_at' => '2025-01-03 00:00:00', 'updated_at' => '2025-01-03 00:00:00'],
                ['id' => 7, 'answer' => 'Yes', 'poll_id' => 4, 'vote_count' => 0, 'created_at' => '2025-01-04 00:00:00', 'updated_at' => '2025-01-04 00:00:00'],
                ['id' => 8, 'answer' => 'No', 'poll_id' => 4, 'vote_count' => 0, 'created_at' => '2025-01-04 00:00:00', 'updated_at' => '2025-01-04 00:00:00'],
            ],
        ]);
    }

    #[Test]
    public function can_list_all_global_polls()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        $this->assertCount(4, $data);
    }

    #[Test]
    public function can_filter_ended_polls()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])->withQueryParams(['filter' => ['isEnded' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        $this->assertCount(2, $data);

        $ids = array_column($data, 'id');
        $this->assertContains('3', $ids);
        $this->assertContains('4', $ids);

        foreach ($data as $poll) {
            $this->assertTrue($poll['attributes']['hasEnded']);
        }
    }

    #[Test]
    public function can_filter_active_polls()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])->withQueryParams(['filter' => ['-isEnded' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        $this->assertCount(2, $data);

        $ids = array_column($data, 'id');
        $this->assertContains('1', $ids);
        $this->assertContains('2', $ids);

        foreach ($data as $poll) {
            $this->assertFalse($poll['attributes']['hasEnded']);
        }
    }

    #[Test]
    public function active_filter_includes_null_end_date()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])->withQueryParams(['filter' => ['-isEnded' => '1']])
        );

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        $ids = array_column($data, 'id');
        $this->assertContains('1', $ids, 'Poll with null end_date should appear in active filter');

        $poll1 = collect($data)->firstWhere('id', '1');
        $this->assertNull($poll1['attributes']['endDate']);
    }

    #[Test]
    public function active_filter_includes_future_end_date()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])->withQueryParams(['filter' => ['-isEnded' => '1']])
        );

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        $ids = array_column($data, 'id');
        $this->assertContains('2', $ids, 'Poll with future end_date should appear in active filter');

        $poll2 = collect($data)->firstWhere('id', '2');
        $this->assertNotNull($poll2['attributes']['endDate']);
        $this->assertFalse($poll2['attributes']['hasEnded']);
    }

    #[Test]
    public function ended_filter_excludes_null_end_date()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])->withQueryParams(['filter' => ['isEnded' => '1']])
        );

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        $ids = array_column($data, 'id');
        $this->assertNotContains('1', $ids, 'Poll with null end_date should NOT appear in ended filter');
        $this->assertNotContains('2', $ids, 'Poll with future end_date should NOT appear in ended filter');
    }
}
