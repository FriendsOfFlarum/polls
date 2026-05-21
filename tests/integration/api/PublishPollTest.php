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
use PHPUnit\Framework\Attributes\Test;

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
                ['id' => 3, 'username' => 'author', 'email' => 'author@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'outsider', 'email' => 'outsider@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 5, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'groups' => [
                ['id' => 10, 'name_singular' => 'Author', 'name_plural' => 'Authors'],
                ['id' => 11, 'name_singular' => 'Outsider', 'name_plural' => 'Outsiders'],
                ['id' => 12, 'name_singular' => 'Moderator', 'name_plural' => 'Moderators'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 3],
                ['user_id' => 3, 'group_id' => 10],
                ['user_id' => 4, 'group_id' => 3],
                ['user_id' => 4, 'group_id' => 11],
                ['user_id' => 5, 'group_id' => 3],
                ['user_id' => 5, 'group_id' => 12],
            ],
            'group_permission' => [
                ['permission' => 'viewForum', 'group_id' => 3],
                ['permission' => 'startGlobalPoll', 'group_id' => 10],
                ['permission' => 'polls.selfEdit', 'group_id' => 10],
                ['permission' => 'startGlobalPoll', 'group_id' => 12],
                ['permission' => 'polls.selfEdit', 'group_id' => 12],
                ['permission' => 'polls.moderate', 'group_id' => 12],
            ],
            'polls' => [
                ['id' => 10, 'question' => 'Draft Poll', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                ['id' => 11, 'question' => 'Published Poll', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2021-01-01 00:00:00'],
                ['id' => 12, 'question' => 'Scheduled Draft', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => '2099-01-01 00:00:00'],
                ['id' => 13, 'question' => 'Draft with end date', 'post_id' => null, 'user_id' => 3, 'end_date' => '2030-01-01 00:00:00', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                ['id' => 14, 'question' => 'Empty Draft', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                ['id' => 15, 'question' => 'Draft with past end date', 'post_id' => null, 'user_id' => 3, 'end_date' => '2020-01-01 00:00:00', 'created_at' => '2019-12-01 00:00:00', 'updated_at' => '2019-12-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
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
                ['id' => 108, 'answer' => 'A', 'poll_id' => 15, 'vote_count' => 0, 'created_at' => '2019-12-01 00:00:00', 'updated_at' => '2019-12-01 00:00:00'],
                ['id' => 109, 'answer' => 'B', 'poll_id' => 15, 'vote_count' => 0, 'created_at' => '2019-12-01 00:00:00', 'updated_at' => '2019-12-01 00:00:00'],
            ],
        ]);
    }

    #[Test]
    public function publishImmediatelySetsPublishedAt(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        $this->assertNotNull($body['data']['attributes']['publishedAt']);
        $this->assertFalse($body['data']['attributes']['isDraft']);
    }

    #[Test]
    public function publishAlreadyPublishedReturns403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/11/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function publishAsNonAuthorNonModReturns404(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
                'authenticatedAs' => 4,
                'json'            => [],
            ])
        );

        $this->assertEquals(404, $response->getStatusCode());
    }

    #[Test]
    public function publishWithScheduledForFutureStoresSchedule(): void
    {
        $future = Carbon::now()->addDays(7)->toIso8601String();

        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
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

    #[Test]
    public function publishWithScheduledForPastReturns422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
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

    #[Test]
    public function publishWithScheduledForNaiveTimestampReturns422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
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

    #[Test]
    public function publishWithScheduledForNonsenseStringReturns422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
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

    #[Test]
    public function publishWithScheduledForNumericOffsetIsNormalizedToUtc(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/10/publish', [
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
        $this->assertStringStartsWith('2099-05-01T08:00:00', $body['data']['attributes']['scheduledPublishAt']);
    }

    #[Test]
    public function publishWithScheduledForAfterEndDateReturns422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/13/publish', [
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

    #[Test]
    public function publishWithScheduledForNullCancelsExistingSchedule(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/12/publish', [
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

    #[Test]
    public function createDraftThenPublishViaReturnedId(): void
    {
        $createResponse = $this->send(
            $this->request('POST', '/api/polls', [
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
            $this->request('POST', "/api/polls/{$pollId}/publish", [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(200, $publishResponse->getStatusCode());

        $body = json_decode($publishResponse->getBody(), true);
        $this->assertNotNull($body['data']['attributes']['publishedAt']);
        $this->assertFalse($body['data']['attributes']['isDraft']);
    }

    #[Test]
    public function publishMissingOptionsReturns422(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/14/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }

    #[Test]
    public function publishOfDraftWithPastEndDateReturns422WithActionableMessage(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/15/publish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        $pointers = array_map(fn ($err) => $err['source']['pointer'] ?? null, $body['errors']);
        $this->assertContains('/data/attributes/endDate', $pointers);

        $details = array_map(fn ($err) => $err['detail'] ?? null, $body['errors']);
        $this->assertContains('Poll end date has already passed; update or clear it before publishing.', $details);
    }
}
