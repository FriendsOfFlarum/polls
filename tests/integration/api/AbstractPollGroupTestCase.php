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

use Flarum\Testing\integration\TestCase;

abstract class AbstractPollGroupTestCase extends TestCase
{
    public static function enablePollGroup(): void
    {
        if (!defined('FOF_POLLS_TESTS_POLL_GROUP_ENABLED')) {
            define('FOF_POLLS_TESTS_POLL_GROUP_ENABLED', true);
        }
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');
        $this->prepareDatabase($this->getDefaultData());
        static::enablePollGroup();
    }

    protected function getDefaultData(): array
    {
        return [
            'users' => [
                $this->getNormalUser(),
                $this->getUnauthorizedUser(),
                $this->getModeratorUser(),
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
        ];
    }

    protected function getNormalUser(): array
    {
        return ['id' => 4, 'username' => 'normal', 'email' => 'normal@machine.local', 'is_email_confirmed' => 1];
    }

    protected function getUnauthorizedUser(): array
    {
        return ['id' => 2, 'username' => 'unauthorized', 'email' => 'unauthorized@machine.local', 'is_email_confirmed' => 1];
    }

    protected function getModeratorUser(): array
    {
        return ['id' => 3, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => 1];
    }

    protected function getDefaultPollGroup(): array
    {
        return ['id' => 1, 'name' => 'Test Group', 'user_id' => 4];
    }

    protected function getDefaultPoll(): array
    {
        return ['id' => 1, 'question' => 'Test Poll', 'poll_group_id' => 1, 'user_id' => 1];
    }
}
