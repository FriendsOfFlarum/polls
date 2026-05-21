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
                $this->normalUser(),                                                                                                   // id 2
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
                ['user_id' => 3, 'group_id' => 10],
                ['user_id' => 4, 'group_id' => 11],
                ['user_id' => 5, 'group_id' => 12],
            ],
            'group_permission' => [
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

    public function test_outsider_does_not_see_draft_in_list(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 4])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertNotContains('100', $ids, 'Outsider must not see draft even when explicitly filtering for drafts');
    }

    public function test_author_sees_own_draft(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 3])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertContains('100', $ids);
    }

    public function test_moderator_sees_draft(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 5])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertContains('100', $ids);
    }

    public function test_admin_sees_draft(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 1])  // admin
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertContains('100', $ids);
    }

    public function test_default_list_excludes_drafts_even_for_author(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 3])  // no filter
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertNotContains('100', $ids, 'Default list must not include drafts (even own) — used by the showcase');
        $this->assertContains('101', $ids);
    }

    public function test_isDraft_filter_returns_only_drafts(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 3])
                ->withQueryParams(['filter' => ['isDraft' => '1']])
        );
        $body = json_decode($response->getBody(), true);
        $ids = array_column($body['data'] ?? [], 'id');

        $this->assertEquals(['100'], $ids);
    }
}
