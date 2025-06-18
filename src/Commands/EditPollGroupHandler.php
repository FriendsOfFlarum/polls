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

use FoF\Polls\Events\SavingPollGroup;
use FoF\Polls\PollGroup;
use FoF\Polls\Validators\PollGroupValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class EditPollGroupHandler
{
    protected $validator;
    protected $events;

    public function __construct(PollGroupValidator $validator, Dispatcher $events)
    {
        $this->validator = $validator;
        $this->events = $events;
    }

    public function handle(EditPollGroup $command)
    {
        $actor = $command->actor;
        $data = $command->data;
        $attributes = Arr::get($data, 'attributes', []);

        $group = PollGroup::findOrFail($command->groupId);
        $actor->assertCan('edit', $group);

        $this->validator->assertValid($data);

        if (array_key_exists('name', $attributes)) {
            $group->name = Arr::get($attributes, 'name');
        }

        $this->events->dispatch(new SavingPollGroup($actor, $group, $data));

        $group->save();

        return $group;
    }
}
