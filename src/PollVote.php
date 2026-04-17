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

use Flarum\Database\AbstractModel;
use Flarum\User\User;

/**
 * @property Poll           $poll
 * @property PollOption     $option
 * @property User           $user
 * @property int            $poll_id
 * @property int            $option_id
 * @property int            $user_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class PollVote extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    public $timestamps = true;

    protected $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime'];

    protected $fillable = ['user_id', 'option_id'];

    /**
     * @param $pollId
     * @param $userId
     * @param $optionId
     *
     * @return static
     */
    public static function build(int $pollId, int $userId, int $optionId): static
    {
        $vote = new static();

        $vote->poll_id = $pollId;
        $vote->user_id = $userId;
        $vote->option_id = $optionId;

        return $vote;
    }

    public function poll(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Poll::class);
    }

    public function option(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PollOption::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
