<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls;

use Carbon\Carbon;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Without an option_id, the vote gets a new option of its own poll. Pass
 * poll_id with option_id: the factory can't look up an option's poll before
 * the rows are inserted.
 */
class PollVoteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'poll_id'    => Poll::factory(),
            'option_id'  => fn (array $attributes) => PollOption::factory()->state(['poll_id' => $attributes['poll_id']]),
            'user_id'    => User::factory(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
