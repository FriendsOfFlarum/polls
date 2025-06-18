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
use FoF\Polls\Validators\PollGroupValidator;
use Illuminate\Support\Arr;
use FoF\Polls\Events\SavingPollGroup;
use Illuminate\Contracts\Events\Dispatcher;

class CreatePollGroupHandler
{
    protected $validator;
    protected $events;

    public function __construct(PollGroupValidator $validator, Dispatcher $events)
    {
        $this->validator = $validator;
        $this->events = $events;
    }

    public function handle(CreatePollGroup $command)
    {
        $actor = $command->actor;
        $data = $command->data;
        $attributes = Arr::get($data, 'attributes', []);

        $actor->assertCan('startPollGroup');

        $this->validator->assertValid($data);

        $group = new PollGroup();
        $group->name = Arr::get($attributes, 'name');
        $group->user_id = $actor->id;

        $this->events->dispatch(new SavingPollGroup($actor, $group, $data));

        $group->save();

        return $group;
    }
}