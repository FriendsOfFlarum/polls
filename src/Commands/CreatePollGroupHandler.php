<?php

namespace FoF\Polls\Commands;

use FoF\Polls\PollGroup;
use FoF\Polls\Validators\PollGroupValidator;
use Illuminate\Support\Arr;

class CreatePollGroupHandler
{
    protected $validator;

    public function __construct(PollGroupValidator $validator)
    {
        $this->validator = $validator;
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

        $group->save();

        return $group;
    }
}