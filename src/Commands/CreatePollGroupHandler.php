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

use FoF\Polls\Events\SavedPollGroup;
use FoF\Polls\Events\SavingPollGroup;
use FoF\Polls\PollGroup;
use FoF\Polls\PollGroupRepository;
use FoF\Polls\Validators\PollGroupValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class CreatePollGroupHandler
{
    protected $pollGroups;
    protected $validator;
    protected $events;

    public function __construct(PollGroupRepository $pollGroups, PollGroupValidator $validator, Dispatcher $events)
    {
        $this->pollGroups = $pollGroups;
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

        $group = $this->pollGroups::createPollGroup($actor, $attributes['name']);

        $this->events->dispatch(new SavingPollGroup($actor, $group, $data));

        $group->save();

        $this->events->dispatch(new SavedPollGroup($actor, $group, $data));

        return $group;
    }
}