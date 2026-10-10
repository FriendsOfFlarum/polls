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
use Illuminate\Database\Eloquent\Factories\Factory;

class PollOptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'answer'     => ucfirst($this->faker->word()),
            'image_url'  => null,
            'poll_id'    => Poll::factory(),
            'vote_count' => 0,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
