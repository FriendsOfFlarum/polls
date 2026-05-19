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
use PHPUnit\Framework\Attributes\Test;

class ListDraftsVisibilityTest extends TestCase
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
                ['id' => 3, 'username' => 'author',    'email' => 'author@local',    'password' => 'pw123456', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'outsider',  'email' => 'outsider@local',  'password' => 'pw123456', 'is_email_confirmed' => true],
                ['id' => 5, 'username' => 'moderator', 'email' => 'moderator@local', 'password' => 'pw123456', 'is_email_confirmed' => true],
            ],
            'groups' => [
                ['id' => 10, 'name_singular' => 'Author',    'name_plural' => 'Authors',    'color' => '', 'icon' => ''],
                ['id' => 11, 'name_singular' => 'Outsider',  'name_plural' => 'Outsiders',  'color' => '', 'icon' => ''],
                ['id' => 12, 'name_singular' => 'Moderator', 'name_plural' => 'Moderators', 'color' => '', 'icon' => ''],
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
                ['permission' => 'polls.selfEdit',  'group_id' => 10],
                ['permission' => 'polls.moderate',  'group_id' => 12],
            ],
            'polls' => [
                ['id' => 100, 'user_id' => 3, 'post_id' => null, 'question' => 'Draft',     'settings' => '{}', 'created_at' => '2026-04-17 10:00:00', 'updated_at' => '2026-04-17 10:00:00', 'published_at' => null],
                ['id' => 101, 'user_id' => 3, 'post_id' => null, 'question' => 'Published', 'settings' => '{}', 'created_at' => '2026-04-17 10:00:00', 'updated_at' => '2026-04-17 10:00:00', 'published_at' => '2026-04-17 10:00:00'],
            ],
        ]);
    }

    #[Test]
    public function outsiderDoesNotSeeDraftInList(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', ['authenticatedAs' => 4])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertNotContains('100', $ids, 'Outsider must not see draft even when explicitly filtering for drafts');
    }

    #[Test]
    public function authorSeesOwnDraft(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', ['authenticatedAs' => 3])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertContains('100', $ids);
    }

    #[Test]
    public function moderatorSeesDraft(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', ['authenticatedAs' => 5])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertContains('100', $ids);
    }

    #[Test]
    public function adminSeesDraft(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', ['authenticatedAs' => 1])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertContains('100', $ids);
    }

    #[Test]
    public function defaultListExcludesDraftsEvenForAuthor(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', ['authenticatedAs' => 3])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertNotContains('100', $ids, 'Default list must not include drafts (even own) — used by the showcase');
        $this->assertContains('101', $ids);
    }

    #[Test]
    public function isDraftFilterReturnsOnlyDrafts(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/polls', ['authenticatedAs' => 3])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertEquals(['100'], $ids);
    }
}
