<?php

namespace FoF\Polls\Commands;

use Flarum\User\User;

class CreatePollGroup
{
    public $actor;
    public $data;

    public function __construct(User $actor, array $data)
    {
        $this->actor = $actor;
        $this->data = $data;
    }
}