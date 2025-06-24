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

use FoF\Polls\Events\DeletedPollGroup;
use FoF\Polls\Events\DeletingPollGroup;
use FoF\Polls\PollGroup;
use Illuminate\Contracts\Events\Dispatcher;

class DeletePollGroupHandler
{
    protected $events;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function handle(DeletePollGroup $command)
    {
        $actor = $command->actor;
        $group = PollGroup::findOrFail($command->groupId);

        $actor->assertCan('delete', $group);

        $this->events->dispatch(new DeletingPollGroup($actor, $group));

        $group->delete();

        $this->events->dispatch(new DeletedPollGroup($actor, $group));

        return $group;
    }
}
