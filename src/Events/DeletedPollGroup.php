<?php
namespace FoF\Polls\Events;

use Flarum\User\User;
use FoF\Polls\PollGroup;

class DeletedPollGroup
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var PollGroup
     */
    public $pollGroup;
    
    public function __construct(User $actor, PollGroup $pollGroup)
    {
        $this->actor = $actor;
        $this->pollGroup = $pollGroup;
    }
}