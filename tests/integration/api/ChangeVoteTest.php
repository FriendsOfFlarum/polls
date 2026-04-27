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
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Polls\PollVote;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class ChangeVoteTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'polluser', 'email' => 'polluser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 5, 'username' => 'noperms', 'email' => 'noperms@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => false],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            Post::class => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1', 'type' => 'comment'],
            ],
            'polls' => [
                ['id' => 1, 'question' => 'Testing Poll--Global', 'subtitle' => 'Testing subtitle', 'image' => 'pollimage-abcdef.png', 'image_alt' => 'test alt', 'post_id' => null, 'user_id' => 1, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
                ['id' => 2, 'question' => 'Testing Poll--Global 2', 'subtitle' => 'Testing subtitle', 'image' => 'pollimage-abcdef.png', 'image_alt' => 'test alt', 'post_id' => null, 'user_id' => 1, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": true,"allow_multiple_votes": false}'],
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
                ['permission' => 'discussion.polls.vote', 'group_id' => 3],
                ['permission' => 'discussion.polls.start', 'group_id' => 4],
                ['permission' => 'startGlobalPoll', 'group_id' => 4],
                ['permission' => 'discussion.polls.vote', 'group_id' => 4],
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

    public static function usersWhoCanChangeVote(): array
    {
        return [
            [1],
            [4],
        ];
    }

    #[Test]
    public function validation_error_when_no_data_is_passed()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/1/votes', [
                'authenticatedAs' => 4,
                'json'            => [],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        $this->assertEquals('The options field must be an array.', $data['errors'][0]['detail']);
        $this->assertEquals('/data/attributes/options', $data['errors'][0]['source']['pointer']);
    }

    #[Test]
    #[DataProvider('usersWhoCanChangeVote')]
    public function user_with_permission_can_change_vote_on_no_change_poll(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/1/votes', [
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

    #[Test]
    public function user_without_permission_cannot_change_vote_on_no_change_poll()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/1/votes', [
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

    #[Test]
    #[DataProvider('usersWhoCanChangeVote')]
    public function user_with_permission_can_change_vote_on_change_poll(int $userId)
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/2/votes', [
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

    #[Test]
    public function user_without_permission_can_change_vote_on_change_poll()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/2/votes', [
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

    #[Test]
    public function vote_response_includes_options_and_myVotes()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/2/votes', [
                'authenticatedAs' => 4,
                'json'            => [
                    'data' => [
                        'optionIds' => [
                            3,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];

        // Response should include the poll with relationships
        $this->assertEquals('polls', $data['type']);
        $this->assertArrayHasKey('options', $data['relationships']);
        $this->assertArrayHasKey('myVotes', $data['relationships']);

        // Included resources should contain options with vote counts and myVotes
        $included = $json['included'] ?? [];
        $optionTypes = array_filter($included, fn ($r) => $r['type'] === 'poll_options');
        $voteTypes = array_filter($included, fn ($r) => $r['type'] === 'poll_votes');

        $this->assertNotEmpty($optionTypes, 'Response should include poll_options');
        $this->assertNotEmpty($voteTypes, 'Response should include poll_votes (myVotes)');

        // Check that options have voteCount attribute
        $firstOption = reset($optionTypes);
        $this->assertArrayHasKey('voteCount', $firstOption['attributes']);
    }

    #[Test]
    public function user_without_vote_permission_cannot_vote_on_global_poll()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/2/votes', [
                'authenticatedAs' => 5,
                'json'            => [
                    'data' => [
                        'optionIds' => [
                            3,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertFalse(PollVote::where('user_id', 5)->where('poll_id', 2)->exists());
    }
}
