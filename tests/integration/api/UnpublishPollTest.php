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
use FoF\Polls\Poll;

class UnpublishPollTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->setting('fof-polls.enableGlobalPolls', true);

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                // Author (group 10)
                ['id' => 3, 'username' => 'author', 'email' => 'author@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                // Outsider (group 11)
                ['id' => 4, 'username' => 'outsider', 'email' => 'outsider@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                // Moderator (group 12)
                ['id' => 5, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'groups' => [
                ['id' => 10, 'name_singular' => 'Author', 'name_plural' => 'Authors'],
                ['id' => 11, 'name_singular' => 'Outsider', 'name_plural' => 'Outsiders'],
                ['id' => 12, 'name_singular' => 'Moderator', 'name_plural' => 'Moderators'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 10],
                ['user_id' => 4, 'group_id' => 11],
                ['user_id' => 5, 'group_id' => 12],
            ],
            'group_permission' => [
                // Author can start global polls and self-edit
                ['permission' => 'startGlobalPoll', 'group_id' => 10],
                ['permission' => 'polls.selfEdit', 'group_id' => 10],
                // Moderator has full mod rights
                ['permission' => 'startGlobalPoll', 'group_id' => 12],
                ['permission' => 'polls.selfEdit', 'group_id' => 12],
                ['permission' => 'polls.moderate', 'group_id' => 12],
            ],
            'polls' => [
                // 20 = published, 0 votes (unpublishable)
                ['id' => 20, 'question' => 'Published Poll', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2021-01-01 00:00:00'],
                // 21 = published with 1 vote (NOT unpublishable)
                ['id' => 21, 'question' => 'Published with votes', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 1, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2021-01-01 00:00:00'],
                // 22 = draft (published_at null)
                ['id' => 22, 'question' => 'Draft Poll', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                // 23 = published, used for list-filter test
                ['id' => 23, 'question' => 'Published For List', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2021-01-01 00:00:00'],
            ],
            'poll_options' => [
                ['id' => 200, 'answer' => 'A', 'poll_id' => 20, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 201, 'answer' => 'B', 'poll_id' => 20, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 202, 'answer' => 'A', 'poll_id' => 21, 'vote_count' => 1, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 203, 'answer' => 'B', 'poll_id' => 21, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 204, 'answer' => 'A', 'poll_id' => 22, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 205, 'answer' => 'B', 'poll_id' => 22, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 206, 'answer' => 'A', 'poll_id' => 23, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 207, 'answer' => 'B', 'poll_id' => 23, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
        ]);
    }

    public function test_unpublish_clears_published_at(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/20/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        $this->assertNull($body['data']['attributes']['publishedAt']);
        $this->assertTrue($body['data']['attributes']['isDraft']);

        $poll = Poll::find(20);
        $this->assertNull($poll->published_at);
    }

    // NOTE: Plan named this test `test_unpublish_fails_when_votes_exist_422`,
    // but the policy denies via assertCan('unpublish') which throws
    // PermissionDeniedException → HTTP 403, not a ValidationException (422).
    public function test_unpublish_fails_when_votes_exist_403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/21/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    public function test_unpublish_on_draft_returns_403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/22/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    public function test_unpublish_as_non_author_returns_403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/20/unpublish', [
                'authenticatedAs' => 4,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    public function test_unpublish_removes_from_default_list_and_adds_to_isDraft_filter(): void
    {
        // Unpublish poll 23 as author
        $unpublish = $this->send(
            $this->request('POST', '/api/fof/polls/23/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );
        $this->assertEquals(200, $unpublish->getStatusCode());

        // Default list (public) must not include poll 23 now that it's a draft
        $defaultList = $this->send(
            $this->request('GET', '/api/fof/polls', [
                'authenticatedAs' => 3,
            ])
        );
        $this->assertEquals(200, $defaultList->getStatusCode());
        $defaultBody = json_decode($defaultList->getBody(), true);
        $ids = array_map(fn ($row) => (int) $row['id'], $defaultBody['data']);
        $this->assertNotContains(23, $ids, 'Unpublished poll should be excluded from default list');

        // isDraft filter (as moderator) must include poll 23
        $draftList = $this->send(
            $this->request('GET', '/api/fof/polls', [
                'authenticatedAs' => 5,
            ])->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $this->assertEquals(200, $draftList->getStatusCode());
        $draftBody = json_decode($draftList->getBody(), true);
        $draftIds = array_map(fn ($row) => (int) $row['id'], $draftBody['data']);
        $this->assertContains(23, $draftIds, 'Unpublished poll should appear in isDraft filter');
    }
}
