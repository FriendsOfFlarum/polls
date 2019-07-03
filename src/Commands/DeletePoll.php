<?php


namespace FoF\Polls\Commands;

use Flarum\User\User;

class DeletePoll
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var int
     */
    public $pollId;

    /**
     * @param User $actor
     * @param int $pollId
     */
    public function __construct(User $actor, int $pollId)
    {
        $this->actor = $actor;
        $this->pollId = $pollId;
    }
}