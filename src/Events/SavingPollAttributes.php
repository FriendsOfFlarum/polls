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
    public function __construct(public User $actor, public Poll $poll, public array $attributes, public array $data)
    {
    }
}
