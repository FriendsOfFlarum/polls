<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Extender;

use Flarum\Settings\SettingsRepositoryInterface;

class IsPollGroupEnabled
{
    public function __invoke(SettingsRepositoryInterface $settings)
    {
        if (defined('FOF_POLLS_TESTS_POLL_GROUP_ENABLED')) {
            return true;
        }

        return (bool) $settings->get('fof-polls.enablePollGroups', false);
    }
}
