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

class PollGroupFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'       => ucfirst($this->faker->words(3, true)),
            'user_id'    => User::factory(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
