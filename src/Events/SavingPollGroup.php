<?php

namespace FoF\Polls\Events;

use Flarum\User\User;
use FoF\Polls\PollGroup;

class SavingPollGroup
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var PollGroup
     */
    public $pollGroup;

    /**
     * @var array
     */
    public $data;

    /**
     * @param  User  $actor
     * @param  PollGroup  $pollGroup
     * @param  array  $data
     */
    public function __construct(User $actor, PollGroup $pollGroup, array $data)
    {
        $this->actor = $actor;
        $this->pollGroup = $pollGroup;
        $this->data = $data;
    }
}