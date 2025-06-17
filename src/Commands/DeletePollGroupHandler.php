<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use FoF\Polls\PollGroup;

class DeletePollGroupHandler
{
    public function handle(DeletePollGroup $command)
    {
        $actor = $command->actor;
        $group = PollGroup::findOrFail($command->groupId);

        $actor->assertCan('delete', $group);

        $group->delete();

        return $group;
    }
}
