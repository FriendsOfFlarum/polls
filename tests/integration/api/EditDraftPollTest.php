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
use FoF\Polls\PollOption;
use PHPUnit\Framework\Attributes\Test;

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
                ['id' => 1, 'title' => 'Discussion 1', 'slug' => 'discussion-1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1', 'type' => 'comment'],
            ],
            Poll::class => [
                ['id' => 10, 'question' => 'Draft Poll', 'user_id' => 1, 'settings' => ['allow_change_vote' => false], 'published_at' => null],
                ['id' => 11, 'question' => 'Scheduled Draft', 'user_id' => 1, 'settings' => ['allow_change_vote' => false], 'published_at' => null, 'scheduled_publish_at' => '2099-01-01 00:00:00'],
                ['id' => 12, 'question' => 'Published Poll', 'user_id' => 1, 'settings' => ['allow_change_vote' => false], 'published_at' => '2021-01-01 00:00:00'],
            ],
            PollOption::class => [
                ['id' => 10, 'answer' => 'A', 'poll_id' => 10],
                ['id' => 11, 'answer' => 'B', 'poll_id' => 10],
                ['id' => 12, 'answer' => 'A', 'poll_id' => 11],
                ['id' => 13, 'answer' => 'B', 'poll_id' => 11],
                ['id' => 14, 'answer' => 'A', 'poll_id' => 12],
                ['id' => 15, 'answer' => 'B', 'poll_id' => 12],
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

    #[Test]
    public function editingDraftKeepsPublishedAtNull(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/10', [
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

    #[Test]
    public function editingDraftRejectsPastEndDate(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/10', [
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

    #[Test]
    public function editingScheduledDraftWithInvalidDataIsRejectedAndScheduleKept(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/11', [
                'authenticatedAs' => 4,
                'json'            => [
                    'data' => [
                        'attributes' => ['endDate' => '2000-01-01 00:00:00'],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $poll = Poll::find(11);
        $this->assertNotNull($poll->scheduled_publish_at);
        $this->assertNull($poll->published_at);
    }

    #[Test]
    public function editingPublishedPollKeepsPublishedAt(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/12', [
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
