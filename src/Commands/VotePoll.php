<?php

namespace FoF\Polls\Commands;

use Flarum\User\User;

class VotePoll
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
     * @var array
     */
    public $data;

    /**
     * @param User $actor
     * @param int $pollId
     * @param array $data
     */
    public function __construct(User $actor, int $pollId, array $data)
    {
        $this->actor = $actor;
        $this->pollId = $pollId;
        $this->data = $data;
    }
}