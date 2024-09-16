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
use FoF\Polls\PollVote;

class ChangeVoteTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'polluser', 'email' => 'polluser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1', 'type' => 'comment'],
            ],
            'polls' => [
                ['id' => 1, 'question' => 'Testing Poll--Global', 'subtitle' => 'Testing subtitle', 'image' => 'pollimage-abcdef.png', 'image_alt' => 'test alt', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'allow_multiple_votes' => 0, 'max_votes' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
                ['id' => 2, 'question' => 'Testing Poll--Global 2', 'subtitle' => 'Testing subtitle', 'image' => 'pollimage-abcdef.png', 'image_alt' => 'test alt', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'allow_multiple_votes' => 0, 'max_votes' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": true,"allow_multiple_votes": false}'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Option 1', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'pollimage-hijklm.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 2, 'answer' => 'Option 2', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'pollimage-nopqrs.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 3, 'answer' => 'Option 3', 'poll_id' => 2, 'vote_count' => 0, 'image_url' => 'pollimage-hijklm.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 4, 'answer' => 'Option 4', 'poll_id' => 2, 'vote_count' => 0, 'image_url' => 'pollimage-nopqrs.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
            'group_user' => [
                ['user_id' => 4, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'discussion.polls.start', 'group_id' => 4],
                ['permission' => 'startGlobalPoll', 'group_id' => 4],
                ['permission' => 'uploadPollImages', 'group_id' => 4],
                ['permission' => 'polls.changeVote', 'group_id' => 4],
            ],
            'poll_votes' => [
                ['id' => 1, 'poll_id' => 1, 'option_id' => 1, 'user_id' => 1, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
                ['id' => 2, 'poll_id' => 1, 'option_id' => 1, 'user_id' => 2, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
                ['id' => 3, 'poll_id' => 1, 'option_id' => 1, 'user_id' => 4, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
                ['id' => 4, 'poll_id' => 2, 'option_id' => 3, 'user_id' => 1, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
                ['id' => 5, 'poll_id' => 2, 'option_id' => 3, 'user_id' => 2, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
                ['id' => 6, 'poll_id' => 2, 'option_id' => 3, 'user_id' => 4, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ],
        ]);
    }

    public function usersWhoCanChangeVote(): array
    {
        return [
            [1],
            [4],
        ];
    }

    /**
     * @test
     */
    public function validation_error_when_no_data_is_passed()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/1/votes', [
                'authenticatedAs' => 4,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        $this->assertEquals('The options must be an array.', $data['errors'][0]['detail']);
        $this->assertEquals('/data/attributes/options', $data['errors'][0]['source']['pointer']);
    }

    /**
     * @test
     *
     * @dataProvider usersWhoCanChangeVote
     */
    public function user_with_permission_can_change_vote_on_no_change_poll(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/1/votes', [
                'authenticatedAs' => $userId,
                'json'            => [
                    'data' => [
                        'optionIds' => [
                            2,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $vote = PollVote::where('user_id', $userId)->where('poll_id', 1)->first();

        $this->assertEquals(2, $vote->option_id);
    }

    /**
     * @test
     */
    public function user_without_permission_cannot_change_vote_on_no_change_poll()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/1/votes', [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'optionIds' => [
                            2,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());

        $vote = PollVote::where('user_id', 2)->where('poll_id', 1)->first();

        $this->assertEquals(1, $vote->option_id);
    }

    /**
     * @test
     *
     * @dataProvider usersWhoCanChangeVote
     */
    public function user_with_permission_can_change_vote_on_change_poll(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/2/votes', [
                'authenticatedAs' => $userId,
                'json'            => [
                    'data' => [
                        'optionIds' => [
                            4,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $vote = PollVote::where('user_id', $userId)->where('poll_id', 2)->first();

        $this->assertEquals(4, $vote->option_id);
    }

    /**
     * @test
     */
    public function user_without_permission_can_change_vote_on_change_poll()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/2/votes', [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'optionIds' => [
                            4,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $vote = PollVote::where('user_id', 2)->where('poll_id', 2)->first();

        $this->assertEquals(4, $vote->option_id);
    }
}
