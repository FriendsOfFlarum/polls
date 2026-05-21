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

class PollsDirectoryTest extends TestCase
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
                ['id' => 1, 'question' => 'Global poll one', 'subtitle' => 'First poll', 'image' => null, 'image_alt' => null, 'post_id' => null, 'user_id' => 1, 'end_date' => null, 'created_at' => '2025-01-01 00:00:00', 'updated_at' => '2025-01-01 00:00:00', 'vote_count' => 5, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2025-01-01 00:00:00'],
                ['id' => 2, 'question' => 'Global poll two', 'subtitle' => null, 'image' => null, 'image_alt' => null, 'post_id' => null, 'user_id' => 1, 'end_date' => '2030-01-01 00:00:00', 'created_at' => '2025-01-02 00:00:00', 'updated_at' => '2025-01-02 00:00:00', 'vote_count' => 10, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2025-01-01 00:00:00'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Yes', 'poll_id' => 1, 'vote_count' => 3, 'created_at' => '2025-01-01 00:00:00', 'updated_at' => '2025-01-01 00:00:00'],
                ['id' => 2, 'answer' => 'No', 'poll_id' => 1, 'vote_count' => 2, 'created_at' => '2025-01-01 00:00:00', 'updated_at' => '2025-01-01 00:00:00'],
                ['id' => 3, 'answer' => 'Yes', 'poll_id' => 2, 'vote_count' => 7, 'created_at' => '2025-01-02 00:00:00', 'updated_at' => '2025-01-02 00:00:00'],
                ['id' => 4, 'answer' => 'No', 'poll_id' => 2, 'vote_count' => 3, 'created_at' => '2025-01-02 00:00:00', 'updated_at' => '2025-01-02 00:00:00'],
            ],
        ]);
    }

    #[Test]
    public function polls_directory_page_returns_200()
    {
        $response = $this->send(
            $this->request('GET', '/polls/all', [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function polls_directory_page_contains_poll_questions()
    {
        $response = $this->send(
            $this->request('GET', '/polls/all', [
                'authenticatedAs' => 1,
            ])
        );

        $body = $response->getBody()->getContents();

        $this->assertStringContainsString('Global poll one', $body);
        $this->assertStringContainsString('Global poll two', $body);
    }

    #[Test]
    public function polls_directory_page_contains_api_document_payload()
    {
        $response = $this->send(
            $this->request('GET', '/polls/all', [
                'authenticatedAs' => 1,
            ])
        );

        $body = $response->getBody()->getContents();

        // The page should contain a JSON payload for the JS app to hydrate from
        $this->assertStringContainsString('flarum-json-payload', $body);
        $this->assertStringContainsString('apiDocument', $body);
    }

    #[Test]
    public function api_list_returns_poll_attributes()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];

        $this->assertCount(2, $data);

        $poll = $data[0];
        $this->assertEquals('polls', $poll['type']);
        $this->assertArrayHasKey('question', $poll['attributes']);
        $this->assertArrayHasKey('hasEnded', $poll['attributes']);
        $this->assertArrayHasKey('createdAt', $poll['attributes']);
        $this->assertArrayHasKey('canVote', $poll['attributes']);
        $this->assertArrayHasKey('isGlobal', $poll['attributes']);
    }

    #[Test]
    public function api_list_includes_options()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])
        );

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('included', $json);

        $optionTypes = array_filter($json['included'], fn ($r) => $r['type'] === 'poll_options');
        $this->assertNotEmpty($optionTypes, 'Response should include poll options');
    }

    #[Test]
    public function api_list_default_sort_is_newest()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])
        );

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        // Default sort is -createdAt (newest first), so poll 2 (created 2025-01-02) comes before poll 1 (2025-01-01)
        $this->assertEquals('2', $data[0]['id']);
        $this->assertEquals('1', $data[1]['id']);
    }

    #[Test]
    public function api_list_can_sort_by_vote_count()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])->withQueryParams(['sort' => '-voteCount'])
        );

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        // Poll 2 has 10 votes, poll 1 has 5
        $this->assertEquals('2', $data[0]['id']);
        $this->assertEquals('1', $data[1]['id']);
    }

    #[Test]
    public function api_list_includes_image_srcset_field()
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 1,
            ])
        );

        $data = json_decode($response->getBody()->getContents(), true)['data'];

        // imageSrcset should be present (null for polls without images)
        $this->assertArrayHasKey('imageSrcset', $data[0]['attributes']);
        $this->assertNull($data[0]['attributes']['imageSrcset']);
    }

    #[Test]
    public function guest_can_view_polls_directory()
    {
        $response = $this->send(
            $this->request('GET', '/polls/all')
        );

        $this->assertEquals(200, $response->getStatusCode());
    }
}
