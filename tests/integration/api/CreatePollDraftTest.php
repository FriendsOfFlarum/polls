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

class CreatePollDraftTest extends TestCase
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
                ['id' => 3, 'username' => 'polluser', 'email' => 'polluser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1', 'type' => 'comment'],
            ],
            'poll_groups' => [
                ['id' => 1, 'name' => 'Default Group', 'user_id' => 2],
                ['id' => 2, 'name' => 'Another Group', 'user_id' => 3],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'discussion.polls.start', 'group_id' => 4],
                ['permission' => 'startGlobalPoll', 'group_id' => 4],
                ['permission' => 'viewPollGroups', 'group_id' => 4],
                ['permission' => 'startPollGroup', 'group_id' => 4],
                ['permission' => 'polls.moderate_group', 'group_id' => 4],
            ],
        ]);
    }

    public function test_create_draft_persists_null_published_at(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'attributes' => [
                            'question' => 'Draft question',
                            'isDraft'  => true,
                            'options'  => [['answer' => 'A'], ['answer' => 'B']],
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);
        $this->assertNull($body['data']['attributes']['publishedAt']);
        $this->assertTrue($body['data']['attributes']['isDraft']);
    }

    public function test_create_draft_allows_missing_options(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'attributes' => [
                            'question' => 'Bare draft',
                            'isDraft'  => true,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());
    }

    public function test_create_non_draft_sets_published_at(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'attributes' => [
                            'question' => 'Published from the start',
                            'isDraft'  => false,
                            'options'  => [['answer' => 'A'], ['answer' => 'B']],
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);
        $this->assertNotNull($body['data']['attributes']['publishedAt']);
        $this->assertFalse($body['data']['attributes']['isDraft']);
    }

    public function test_create_discussion_poll_rejects_isDraft_true(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/polls', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'attributes' => [
                            'question' => 'Discussion draft?',
                            'isDraft'  => true,
                            'options'  => [['answer' => 'A'], ['answer' => 'B']],
                        ],
                        'relationships' => [
                            'post' => ['data' => ['type' => 'posts', 'id' => '1']],
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }
}
