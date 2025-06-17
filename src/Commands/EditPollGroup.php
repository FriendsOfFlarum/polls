<?php

namespace FoF\Polls\Commands;

use Flarum\User\User;

class EditPollGroup
{
    public $groupId;
    public $actor;
    public $data;

    public function __construct(User $actor, int $groupId, array $data)
    {
        $this->groupId = $groupId;
        $this->actor = $actor;
        $this->data = $data;
    }
}