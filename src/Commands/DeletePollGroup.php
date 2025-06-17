<?php

namespace FoF\Polls\Commands;

use Flarum\User\User;

class DeletePollGroup
{
    public $actor;
    public $groupId;

    public function __construct(User $actor, int $groupId)
    {
        $this->actor = $actor;
        $this->groupId = $groupId;
    }
}