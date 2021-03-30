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
use Flarum\Discussion\Discussion;
use Flarum\User\User;

/**
 * @property int            $id
 * @property string         $question
 * @property bool           $public_poll
 * @property Discussion     $discussion
 * @property USer           $user
 * @property int            $discussion_id
 * @property int            $user_id
 * @property \Carbon\Carbon $end_date
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Poll extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    public $timestamps = true;

    protected $dates = [
        'created_at',
        'updated_at',
        'end_date',
    ];

    /**
     * @param $question
     * @param $discussionId
     * @param $actorId
     * @param $endDate
     * @param $publicPoll
     *
     * @return static
     */
    public static function build($question, $discussionId, $actorId, $endDate, $publicPoll)
    {
        $poll = new static();

        $poll->question = $question;
        $poll->discussion_id = $discussionId;
        $poll->user_id = $actorId;
        $poll->end_date = $endDate;
        $poll->public_poll = $publicPoll;

        return $poll;
    }

    /**
     * @return bool
     */
    public function hasEnded()
    {
        return $this->end_date !== null && $this->end_date->isPast();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function options()
    {
        return $this->hasMany(PollOption::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function votes()
    {
        return $this->hasMany(PollVote::class);
    }
}
