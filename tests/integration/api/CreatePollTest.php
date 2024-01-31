<?php

namespace FoF\Polls\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Polls\Poll;

class CreatePollTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'polluser', 'email' => 'polluser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true]
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'discussion.polls.start', 'group_id' => 4],
            ],
        ]);
    }

    private function authorizedUserProvider(): array
    {
        return [
            [1],
            [3]
        ];
    }

    private function unauthorizedUserProvider(): array
    {
        return [
            [2],
        ];
    }

    /**
     * @dataProvider authorizedUserProvider
     * @test
     */
    public function authorized_user_can_create_poll_in_post(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/posts',
                [
                    'authenticatedAs' => $userId,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'content' => 'Here is my poll',
                                'poll' => [
                                    'question' => 'What is your favourite colour?',
                                    'publicPoll' => false,
                                    'hideVotes' => false,
                                    'allowChangeVote' => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes' => 0,
                                    'endDate' => false,
                                    'options' => [
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
                                        'id' => 1,
                                    ],
                                ],
                            ]
                        ]
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

        $response = $this->send(
            $this->request(
                'GET',
                '/api/fof/polls/' . $pollId,
                [
                    'authenticatedAs' => $userId,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertFalse($json['data']['attributes']['isGlobal']);
    }

    /**
     * @dataProvider unauthorizedUserProvider
     * @test
     */
    public function unauthorized_user_cannot_create_poll_in_post(int $userId)
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/posts',
                [
                    'authenticatedAs' => $userId,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'content' => 'Here is my poll',
                                'poll' => [
                                    'question' => 'What is your favourite colour?',
                                    'publicPoll' => false,
                                    'hideVotes' => false,
                                    'allowChangeVote' => true,
                                    'allowMultipleVotes' => false,
                                    'maxVotes' => 0,
                                    'endDate' => false,
                                    'options' => [
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
                                        'id' => 1,
                                    ],
                                ],
                            ]
                        ]
                    ],
                ]
            )
        );

        $this->assertEquals(422, $response->getStatusCode());
        $errors = json_decode($response->getBody()->getContents(), true)['errors'];

        $this->assertEquals('validation_error', $errors[0]['code']);
        $this->assertEquals('/data/attributes/poll', $errors[0]['source']['pointer']);
    }
}
