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
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Polls\Poll;

class PublishPollTest extends TestCase
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
                // 10 = draft, 2 options, no end_date, author = user 3
                ['id' => 10, 'question' => 'Draft Poll', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                // 11 = published
                ['id' => 11, 'question' => 'Published Poll', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2021-01-01 00:00:00'],
                // 12 = draft with existing schedule
                ['id' => 12, 'question' => 'Scheduled Draft', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => '2099-01-01 00:00:00'],
                // 13 = draft with end_date set (2030-01-01)
                ['id' => 13, 'question' => 'Draft with end date', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => '2030-01-01 00:00:00', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                // 14 = draft with 0 options
                ['id' => 14, 'question' => 'Empty Draft', 'post_id' => null, 'user_id' => 3, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
            ],
            'poll_options' => [
                ['id' => 100, 'answer' => 'A', 'poll_id' => 10, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 101, 'answer' => 'B', 'poll_id' => 10, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 102, 'answer' => 'A', 'poll_id' => 11, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 103, 'answer' => 'B', 'poll_id' => 11, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 104, 'answer' => 'A', 'poll_id' => 12, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 105, 'answer' => 'B', 'poll_id' => 12, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 106, 'answer' => 'A', 'poll_id' => 13, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 107, 'answer' => 'B', 'poll_id' => 13, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
        ]);
    }

    public function test_publish_immediately_sets_published_at(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        $this->assertNotNull($body['data']['attributes']['publishedAt']);
        $this->assertFalse($body['data']['attributes']['isDraft']);
    }

    public function test_publish_already_published_returns_403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/11/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    public function test_publish_as_non_author_non_mod_returns_404(): void
    {
        // Drafts are hidden from non-authors by ScopePollVisibility, so the
        // repository's findOrFail yields 404 rather than 403 — Flarum's
        // preferred info-hiding behaviour for unauthorised access.
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 4,
                'json'            => [],
            ])
        );

        $this->assertEquals(404, $response->getStatusCode());
    }

    public function test_publish_with_scheduledFor_future_stores_schedule(): void
    {
        $future = Carbon::now()->addDays(7)->toIso8601String();

        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => $future,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);
        $this->assertNull($body['data']['attributes']['publishedAt']);
        $this->assertNotNull($body['data']['attributes']['scheduledPublishAt']);

        $poll = Poll::find(10);
        $this->assertNotNull($poll->scheduled_publish_at);
        $this->assertNull($poll->published_at);
    }

    public function test_publish_with_scheduledFor_past_returns_422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => '2000-01-01T00:00:00+00:00',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_publish_with_scheduledFor_naive_timestamp_returns_422(): void
    {
        // Naive ISO 8601 (no `Z`, no `+HH:MM`) would otherwise be parsed in
        // the server's PHP timezone — silently wrong. PollValidator must
        // reject before business-rule checks run.
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => '2099-01-01T00:00:00',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        $pointers = array_map(fn ($err) => $err['source']['pointer'] ?? null, $body['errors']);
        $this->assertContains('/data/attributes/scheduledFor', $pointers);
    }

    public function test_publish_with_scheduledFor_nonsense_string_returns_422(): void
    {
        // A string that happens to end in `Z` but isn't a valid ISO 8601
        // datetime must fail strict-format parsing (not silently slip
        // through a permissive regex).
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => 'not-a-dateZ',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_publish_with_scheduledFor_numeric_offset_is_normalized_to_utc(): void
    {
        // 10:00 at `+02:00` must be stored as 08:00 UTC.
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => '2099-05-01T10:00:00+02:00',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        // Flarum's JSON:API date formatter emits ISO 8601 UTC (`...+00:00`).
        // 10:00 at +02:00 → 08:00 UTC.
        $this->assertStringStartsWith('2099-05-01T08:00:00', $body['data']['attributes']['scheduledPublishAt']);
    }

    public function test_publish_with_scheduledFor_after_end_date_returns_422(): void
    {
        // Poll 13 has end_date 2030-01-01. Schedule after that.
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/13/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => '2031-01-01T00:00:00+00:00',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_publish_with_scheduledFor_null_cancels_existing_schedule(): void
    {
        // Poll 12 has scheduled_publish_at set
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/12/publish', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'scheduledFor' => null,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $poll = Poll::find(12);
        $this->assertNull($poll->scheduled_publish_at);
        $this->assertNull($poll->published_at);
    }

    public function test_create_draft_then_publish_via_returned_id(): void
    {
        $createResponse = $this->send(
            $this->request('POST', '/api/fof/polls', [
                'authenticatedAs' => 3,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'question' => 'Fresh draft',
                            'isDraft'  => true,
                            'options'  => [['answer' => 'Yes'], ['answer' => 'No']],
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $createResponse->getStatusCode());

        $body = json_decode($createResponse->getBody(), true);
        $pollId = $body['data']['id'];

        $publishResponse = $this->send(
            $this->request('POST', "/api/fof/polls/{$pollId}/publish", [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(200, $publishResponse->getStatusCode());

        $body = json_decode($publishResponse->getBody(), true);
        $this->assertNotNull($body['data']['attributes']['publishedAt']);
        $this->assertFalse($body['data']['attributes']['isDraft']);
    }

    public function test_publish_missing_options_returns_422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls/14/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }
}
