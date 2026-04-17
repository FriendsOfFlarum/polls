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

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Polls\Poll;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class CreatePollTest extends TestCase
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
                ['id' => 3, 'username' => 'polluser', 'email' => 'polluser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            Post::class => [
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

    public static function authorizedUserProvider(): array
    {
        return [
            [1],
            [3],
        ];
    }

    public static function unauthorizedUserProvider(): array
    {
        return [
            [2],
        ];
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_poll_in_post(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/posts',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'content' => 'Here is my poll',
                                'poll'    => [
                                    'question'           => 'What is your favourite colour?',
                                    'publicPoll'         => false,
                                    'hideVotes'          => false,
                                    'allowChangeVote'    => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes'           => 0,
                                    'endDate'            => false,
                                    'options'            => [
                                        [
                                            'answer' => 'Red',
                                        ],
                                        [
                                            'answer' => 'Blue',
                                        ],
                                        [
                                            'answer' => 'Yellow',
                                        ],
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'discussion' => [
                                    'data' => [
                                        'type' => 'discussions',
                                        'id'   => 1,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];

        $this->assertArrayHasKey('polls', $data['relationships']);

        $pollId = $data['relationships']['polls']['data'][0]['id'];
        $this->assertNotNull($pollId);

        $poll = Poll::find($pollId);

        $this->assertNotNull($poll);

        $this->assertEquals('What is your favourite colour?', $poll->question);
        $this->assertNull($poll->subtitle);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/polls/'.$pollId,
                [
                    'authenticatedAs' => $userId,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertFalse($json['data']['attributes']['isGlobal']);
    }

    #[Test]
    #[DataProvider('unauthorizedUserProvider')]
    public function unauthorized_user_cannot_create_poll_in_post(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/posts',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'content' => 'Here is my poll',
                                'poll'    => [
                                    'question'           => 'What is your favourite colour?',
                                    'publicPoll'         => false,
                                    'hideVotes'          => false,
                                    'allowChangeVote'    => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes'           => 0,
                                    'endDate'            => false,
                                    'options'            => [
                                        [
                                            'answer' => 'Red',
                                        ],
                                        [
                                            'answer' => 'Blue',
                                        ],
                                        [
                                            'answer' => 'Yellow',
                                        ],
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'discussion' => [
                                    'data' => [
                                        'type' => 'discussions',
                                        'id'   => 1,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(422, $response->getStatusCode());
        $errors = json_decode($response->getBody()->getContents(), true)['errors'];

        $this->assertEquals('validation_error', $errors[0]['code']);
        $this->assertEquals('/data/attributes/poll', $errors[0]['source']['pointer']);
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_post_poll_on_api(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Add a poll to an existing post',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'post' => [
                                    'data' => [
                                        'type' => 'posts',
                                        'id'   => 1,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];
        $attributes = $data['attributes'];

        $this->assertEquals('Add a poll to an existing post', $attributes['question']);
        $this->assertNull($attributes['subtitle']);

        $pollId = $data['id'];
        $this->assertNotNull($pollId);

        $poll = Poll::find($pollId);
        $this->assertNotNull($poll);
        $this->assertEquals(1, $poll->post_id);
    }

    #[Test]
    #[DataProvider('unauthorizedUserProvider')]
    public function unauthorized_user_cannot_create_post_poll_on_api(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Add a poll to an existing post',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'post' => [
                                    'data' => [
                                        'type' => 'posts',
                                        'id'   => 1,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_cannot_create_post_poll_with_invalid_postId(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Add a poll to an existing post',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'post' => [
                                    'data' => [
                                        'type' => 'posts',
                                        'id'   => 299,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(404, $response->getStatusCode());
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_global_poll_on_api(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Add a global poll',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $data = $json['data'];
        $attributes = $data['attributes'];

        $this->assertEquals('Add a global poll', $attributes['question']);
        $this->assertNull($attributes['subtitle']);

        $pollId = $data['id'];
        $this->assertNotNull($pollId);

        $poll = Poll::find($pollId);
        $this->assertNotNull($poll);
        $this->assertNull($poll->post_id);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/polls/'.$pollId,
                [
                    'authenticatedAs' => $userId,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue($json['data']['attributes']['isGlobal']);
    }

    #[Test]
    #[DataProvider('unauthorizedUserProvider')]
    public function unauthorized_user_cannot_create_global_poll_on_api(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Add a global poll',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_a_poll_with_a_subtitle_via_api(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Add a poll with a subtitle',
                                'subtitle'           => 'This is a subtitle',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $data = $json['data'];
        $attributes = $data['attributes'];

        $this->assertEquals('Add a poll with a subtitle', $attributes['question']);
        $this->assertEquals('This is a subtitle', $attributes['subtitle']);
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_a_poll_with_a_subtitle_via_post(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/posts',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'content' => 'Here is my poll',
                                'poll'    => [
                                    'question'           => 'What is your favourite colour?',
                                    'subtitle'           => 'This is a subtitle',
                                    'publicPoll'         => false,
                                    'hideVotes'          => false,
                                    'allowChangeVote'    => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes'           => 0,
                                    'endDate'            => false,
                                    'options'            => [
                                        [
                                            'answer' => 'Red',
                                        ],
                                        [
                                            'answer' => 'Blue',
                                        ],
                                        [
                                            'answer' => 'Yellow',
                                        ],
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'discussion' => [
                                    'data' => [
                                        'type' => 'discussions',
                                        'id'   => 1,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];

        $this->assertArrayHasKey('polls', $data['relationships']);

        $pollId = $data['relationships']['polls']['data'][0]['id'];
        $this->assertNotNull($pollId);

        $poll = Poll::find($pollId);

        $this->assertNotNull($poll);

        $this->assertEquals('What is your favourite colour?', $poll->question);
        $this->assertEquals('This is a subtitle', $poll->subtitle);
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_poll_via_discussion(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/discussions',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'type'       => 'discussions',
                            'attributes' => [
                                'title'   => 'Discussion with poll',
                                'content' => 'Here is my poll via discussion creation',
                                'poll'    => [
                                    'question'           => 'Best programming language?',
                                    'publicPoll'         => false,
                                    'hideVotes'          => false,
                                    'allowChangeVote'    => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes'           => 0,
                                    'endDate'            => false,
                                    'options'            => [
                                        ['answer' => 'PHP'],
                                        ['answer' => 'TypeScript'],
                                        ['answer' => 'Rust'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];

        // The discussion's first post should have polls included
        $firstPostId = $data['relationships']['firstPost']['data']['id'] ?? null;
        $this->assertNotNull($firstPostId);

        // Find the poll in the included resources or via the post
        $post = \Flarum\Post\Post::find($firstPostId);
        $this->assertNotNull($post);

        $poll = $post->polls()->first();
        $this->assertNotNull($poll, 'Poll should be created on the first post of the discussion');
        $this->assertEquals('Best programming language?', $poll->question);
        $this->assertEquals(3, $poll->options()->count());
    }

    #[Test]
    #[DataProvider('unauthorizedUserProvider')]
    public function unauthorized_user_cannot_create_poll_via_discussion(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/discussions',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'type'       => 'discussions',
                            'attributes' => [
                                'title'   => 'Discussion with poll',
                                'content' => 'Unauthorized poll attempt',
                                'poll'    => [
                                    'question'           => 'Should not work',
                                    'publicPoll'         => false,
                                    'hideVotes'          => false,
                                    'allowChangeVote'    => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes'           => 0,
                                    'endDate'            => false,
                                    'options'            => [
                                        ['answer' => 'Yes'],
                                        ['answer' => 'No'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        // Discussion should still be created (201), but the poll should not
        // The unauthorized user cannot start polls, so the poll is silently skipped
        // or a validation error is returned
        $this->assertContains($response->getStatusCode(), [201, 422]);

        if ($response->getStatusCode() === 201) {
            $json = json_decode($response->getBody()->getContents(), true);
            $firstPostId = $json['data']['relationships']['firstPost']['data']['id'] ?? null;

            if ($firstPostId) {
                $post = \Flarum\Post\Post::find($firstPostId);
                $this->assertTrue($post->polls()->count() === 0, 'Unauthorized user should not create a poll');
            }
        }
    }

    #[Test]
    #[DataProvider('authorizedUserProvider')]
    public function authorized_user_can_create_poll_with_poll_group(int $userId)
    {
        AbstractPollGroupTestCase::enablePollGroup();
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Poll with group',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'pollGroup' => [
                                    'data' => [
                                        'type' => 'poll_groups',
                                        'id'   => '2',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $pollId = $json['data']['id'];

        $poll = Poll::find($pollId);
        $this->assertNotNull($poll);
        $this->assertEquals(2, $poll->poll_group_id);
    }

    #[Test]
    #[DataProvider('unauthorizedUserProvider')]
    public function unauthorized_user_cannot_create_poll_with_poll_group(int $userId)
    {
        AbstractPollGroupTestCase::enablePollGroup();
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => $userId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Poll with group',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'pollGroup' => [
                                    'data' => [
                                        'type' => 'poll_groups',
                                        'id'   => '2',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function cannot_create_poll_with_nonexistent_poll_group()
    {
        AbstractPollGroupTestCase::enablePollGroup();
        $response = $this->send(
            $this->request(
                'POST',
                '/api/polls',
                [
                    'authenticatedAs' => 1,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'question'           => 'Poll with invalid group',
                                'publicPoll'         => false,
                                'hideVotes'          => false,
                                'allowChangeVote'    => true,
                                'allowMultipleVotes' => false,
                                'maxVotes'           => 0,
                                'endDate'            => false,
                                'options'            => [
                                    [
                                        'answer' => 'Yes',
                                    ],
                                    [
                                        'answer' => 'No',
                                    ],
                                ],
                            ],
                            'relationships' => [
                                'pollGroup' => [
                                    'data' => [
                                        'type' => 'poll_groups',
                                        'id'   => '999', // Non-existent ID
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(404, $response->getStatusCode());
    }
}
