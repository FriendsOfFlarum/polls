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
            Poll::class => [
                ['id' => 20, 'question' => 'Published Poll', 'user_id' => 3, 'settings' => ['allow_change_vote' => false], 'published_at' => '2021-01-01 00:00:00'],
                ['id' => 21, 'question' => 'Published with votes', 'user_id' => 3, 'vote_count' => 1, 'settings' => ['allow_change_vote' => false], 'published_at' => '2021-01-01 00:00:00'],
                ['id' => 22, 'question' => 'Draft Poll', 'user_id' => 3, 'settings' => ['allow_change_vote' => false], 'published_at' => null],
                ['id' => 23, 'question' => 'Published For List', 'user_id' => 3, 'settings' => ['allow_change_vote' => false], 'published_at' => '2021-01-01 00:00:00'],
            ],
            PollOption::class => [
                ['id' => 200, 'answer' => 'A', 'poll_id' => 20],
                ['id' => 201, 'answer' => 'B', 'poll_id' => 20],
                ['id' => 202, 'answer' => 'A', 'poll_id' => 21, 'vote_count' => 1],
                ['id' => 203, 'answer' => 'B', 'poll_id' => 21],
                ['id' => 204, 'answer' => 'A', 'poll_id' => 22],
                ['id' => 205, 'answer' => 'B', 'poll_id' => 22],
                ['id' => 206, 'answer' => 'A', 'poll_id' => 23],
                ['id' => 207, 'answer' => 'B', 'poll_id' => 23],
            ],
        ]);
    }

    #[Test]
    public function unpublishClearsPublishedAt(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/20/unpublish', [
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

    #[Test]
    public function unpublishFailsWhenVotesExist403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/21/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function unpublishOnDraftReturns403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/22/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function unpublishAsNonAuthorReturns403(): void
    {
        $response = $this->send(
            $this->request('POST', '/api/polls/20/unpublish', [
                'authenticatedAs' => 4,
                'json'            => [],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function unpublishMovesPollFromPublishedFilterToDraftFilter(): void
    {
        $unpublish = $this->send(
            $this->request('POST', '/api/polls/23/unpublish', [
                'authenticatedAs' => 3,
                'json'            => [],
            ])
        );
        $this->assertEquals(200, $unpublish->getStatusCode());

        $publishedList = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 3,
            ])->withQueryParams(['filter' => ['isDraft' => '0']])
        );
        $this->assertEquals(200, $publishedList->getStatusCode());
        $publishedBody = json_decode($publishedList->getBody(), true);
        $ids = array_map(fn ($row) => (int) $row['id'], $publishedBody['data']);
        $this->assertNotContains(23, $ids, 'Unpublished poll should be excluded from the published-only list');

        $draftList = $this->send(
            $this->request('GET', '/api/polls', [
                'authenticatedAs' => 5,
            ])->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $this->assertEquals(200, $draftList->getStatusCode());
        $draftBody = json_decode($draftList->getBody(), true);
        $draftIds = array_map(fn ($row) => (int) $row['id'], $draftBody['data']);
        $this->assertContains(23, $draftIds, 'Unpublished poll should appear in isDraft filter');
    }
}
