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
 * A published global poll with Poll::build()'s default settings.
 */
class PollFactory extends Factory
{
    public const DEFAULT_SETTINGS = [
        'public_poll'          => false,
        'allow_multiple_votes' => false,
        'max_votes'            => 0,
        'hide_votes'           => false,
        'allow_change_vote'    => true,
    ];

    public function definition(): array
    {
        return [
            'question'      => $this->faker->sentence(),
            'subtitle'      => null,
            'image'         => null,
            'image_alt'     => null,
            'post_id'       => null,
            'poll_group_id' => null,
            'user_id'       => User::factory(),
            'end_date'      => null,
            'published_at'  => Carbon::now(),
            'vote_count'    => 0,
            'settings'      => self::DEFAULT_SETTINGS,
            'created_at'    => Carbon::now(),
            'updated_at'    => Carbon::now(),
        ];
    }

    /**
     * A partial `settings` array is merged over the current settings rather
     * than replacing them: `['settings' => ['public_poll' => true]]`.
     */
    public function state($state)
    {
        if (is_array($state) && is_array($state['settings'] ?? null)) {
            $settings = $state['settings'];
            unset($state['settings']);

            return parent::state($state)->state(fn (array $attributes) => [
                'settings' => array_merge(is_array($attributes['settings']) ? $attributes['settings'] : [], $settings),
            ]);
        }

        return parent::state($state);
    }
}
