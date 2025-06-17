<?php

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