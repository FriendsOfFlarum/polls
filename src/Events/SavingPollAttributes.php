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

/**
 * Dispatched while a poll is being saved
 * This event is triggered in both SavePollsToDatabase and EditPollHandler, which don't have the same data format!
 * For this reason the "attributes" part of the JSON:API payload is provided as a separate attribute since it's almost identical for both situations.
 *
 * The create/edit authorization has already been performed when this event is dispatched, so it doesn't need to be checked again
 *
 * You should not throw any exception if the poll doesn't exist because this happens after the post has already been created and would break email and other extensions
 */
class SavingPollAttributes
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
     * @var array
     */
    public $attributes;

    /**
     * @var array
     */
    public $data;

    /**
     * @param User  $actor
     * @param Poll  $poll
     * @param array $attributes
     * @param array $data
     */
    public function __construct(User $actor, Poll $poll, array $attributes, array $data)
    {
        $this->actor = $actor;
        $this->poll = $poll;
        $this->attributes = $attributes;
        $this->data = $data;
    }
}
