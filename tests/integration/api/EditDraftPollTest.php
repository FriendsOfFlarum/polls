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

class EditDraftPollTest extends TestCase
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
                ['id' => 4, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1', 'type' => 'comment'],
            ],
            'polls' => [
                // Draft (global, published_at null)
                ['id' => 10, 'question' => 'Draft Poll', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null],
                // Scheduled draft
                ['id' => 11, 'question' => 'Scheduled Draft', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => null, 'scheduled_publish_at' => '2099-01-01 00:00:00'],
                // Published global poll for regression
                ['id' => 12, 'question' => 'Published Poll', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}', 'published_at' => '2021-01-01 00:00:00'],
            ],
            'poll_options' => [
                ['id' => 10, 'answer' => 'A', 'poll_id' => 10, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 11, 'answer' => 'B', 'poll_id' => 10, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 12, 'answer' => 'A', 'poll_id' => 11, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 13, 'answer' => 'B', 'poll_id' => 11, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 14, 'answer' => 'A', 'poll_id' => 12, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 15, 'answer' => 'B', 'poll_id' => 12, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
            'group_user' => [
                ['user_id' => 4, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'discussion.polls.start', 'group_id' => 4],
                ['permission' => 'startGlobalPoll', 'group_id' => 4],
                ['permission' => 'uploadPollImages', 'group_id' => 4],
                ['permission' => 'polls.moderate', 'group_id' => 4],
                ['permission' => 'viewPollGroups', 'group_id' => 2],
                ['permission' => 'startPollGroup', 'group_id' => 4],
                ['permission' => 'polls.moderate_group', 'group_id' => 4],
            ],
        ]);
    }

    public function test_editing_draft_keeps_published_at_null(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/10', [
                'authenticatedAs' => 4,
                'json'            => [
                    'data' => [
                        'attributes' => ['question' => 'Edited draft'],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);
        $this->assertNull($body['data']['attributes']['publishedAt']);
        $this->assertTrue($body['data']['attributes']['isDraft']);
    }

    public function test_editing_draft_rejects_past_end_date(): void
    {
        // Drafts go through the same rule set as published polls — saving a
        // past endDate fails fast at the API gate rather than persisting an
        // un-publishable value that surfaces later as a publish error.
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/10', [
                'authenticatedAs' => 4,
                'json'            => [
                    'data' => [
                        'attributes' => ['endDate' => '2000-01-01 00:00:00'],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_editing_scheduled_draft_with_invalid_data_is_rejected_and_schedule_kept(): void
    {
        // Under unified validation, the API rejects the edit before any
        // persistence happens — the schedule cannot be silently cancelled
        // because invalid data never reaches the model.
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/11', [
                'authenticatedAs' => 4,
                'json'            => [
                    'data' => [
                        'attributes' => ['endDate' => '2000-01-01 00:00:00'],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        // Schedule is still intact because the edit never landed.
        $poll = Poll::find(11);
        $this->assertNotNull($poll->scheduled_publish_at);
        $this->assertNull($poll->published_at);
    }

    public function test_editing_published_poll_keeps_published_at(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/fof/polls/12', [
                'authenticatedAs' => 4,
                'json'            => [
                    'data' => [
                        'attributes' => ['question' => 'Edited published'],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);
        $this->assertNotNull($body['data']['attributes']['publishedAt']);
        $this->assertFalse($body['data']['attributes']['isDraft']);
    }
}
