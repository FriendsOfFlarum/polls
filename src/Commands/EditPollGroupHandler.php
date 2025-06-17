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

class EditPollGroupHandler
{
    protected $validator;

    public function __construct(PollGroupValidator $validator)
    {
        $this->validator = $validator;
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

        $group->save();

        return $group;
    }
}
