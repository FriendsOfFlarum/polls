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
use Flarum\User\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * Poll groups, and the polls in them, are only visible with `viewPollGroups`.
 */
class PollGroupVisibilityTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');
        $this->setting('fof-polls.enablePollGroups', true);

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => 1],
            ],
            'group_user'  => [['user_id' => 3, 'group_id' => 4]],
            'poll_groups' => [['id' => 1, 'name' => 'Group', 'user_id' => 1, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00']],
            'polls'       => [
                ['id' => 1, 'question' => 'Grouped poll', 'post_id' => null, 'poll_group_id' => 1, 'user_id' => 1, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'published_at' => '2021-01-01 00:00:00', 'settings' => '{"max_votes":0,"hide_votes":false,"public_poll":false,"allow_change_vote":true,"allow_multiple_votes":false}'],
            ],
            'group_permission' => [['permission' => 'viewPollGroups', 'group_id' => 4]],
        ]);
    }

    public static function withoutPermission(): array
    {
        return ['a member' => [2], 'a guest' => [null]];
    }

    private function get(string $path, ?int $actor): array
    {
        $response = $this->send($this->request('GET', $path, $actor ? ['authenticatedAs' => $actor] : []));

        return [$response->getStatusCode(), json_decode((string) $response->getBody(), true)];
    }

    #[Test]
    #[DataProvider('withoutPermission')]
    public function a_poll_group_is_hidden_without_permission(?int $actor): void
    {
        [$status] = $this->get('/api/poll_groups/1', $actor);
        $this->assertSame(404, $status);

        [$status, $body] = $this->get('/api/poll_groups', $actor);
        $this->assertSame(200, $status);
        $this->assertSame([], $body['data']);
    }

    #[Test]
    #[DataProvider('withoutPermission')]
    public function a_poll_in_a_group_is_hidden_without_permission(?int $actor): void
    {
        [$status] = $this->get('/api/polls/1', $actor);
        $this->assertSame(404, $status);
    }

    #[Test]
    public function a_poll_group_and_its_polls_are_visible_with_permission(): void
    {
        [$status] = $this->get('/api/poll_groups/1', 3);
        $this->assertSame(200, $status);

        [$status, $body] = $this->get('/api/poll_groups', 3);
        $this->assertSame(200, $status);
        $this->assertSame(['1'], array_column($body['data'], 'id'));

        [$status] = $this->get('/api/polls/1', 3);
        $this->assertSame(200, $status);
    }
}
