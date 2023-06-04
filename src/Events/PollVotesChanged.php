<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Events;

use Flarum\User\User;
use FoF\Polls\Poll;
use Illuminate\Support\Collection;

class PollVotesChanged
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var Poll
     */
    public $poll;

    /**
     * @var Collection
     */
    public $unvotedOptionIds;

    /**
     * @var Collection
     */
    public $votedOptionIds;

    /**
     * PollWasCreated constructor.
     *
     * @param User $actor
     * @param Poll $poll
     * @param Collection $unvotedOptionIds
     * @param Collection $votedOptionIds
     */
    public function __construct(User $actor, Poll $poll, Collection $unvotedOptionIds, Collection $votedOptionIds)
    {
        $this->actor = $actor;
        $this->poll = $poll;
        $this->unvotedOptionIds = $unvotedOptionIds;
        $this->votedOptionIds = $votedOptionIds;
    }
}
