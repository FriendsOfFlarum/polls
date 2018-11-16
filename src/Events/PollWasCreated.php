<?php

namespace Reflar\Polls\Events;

use Flarum\Discussion\Discussion;
use Flarum\User\User;
use Reflar\Polls\Question;

class PollWasCreated
{
    /**
     * @var Discussion
     */
    public $discussion;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var Question
     */
    public $poll;

    /**
     * PollWasCreated constructor.
     *
     * @param Discussion $discussion
     * @param Question   $poll
     * @param User       $actor
     */
    public function __construct(Discussion $discussion, Question $poll, User $actor)
    {
        $this->discussion = $discussion;
        $this->poll = $poll;
        $this->actor = $actor;
    }
}
