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
use Flarum\Post\Post;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property int                   $id
 * @property string                $question
 * @property bool                  $public_poll
 * @property bool                  $allow_multiple_votes
 * @property int                   $max_votes
 * @property int                   $vote_count
 * @property Post                  $post
 * @property User                  $user
 * @property int                   $post_id
 * @property int                   $user_id
 * @property \Carbon\Carbon        $end_date
 * @property \Carbon\Carbon        $created_at
 * @property \Carbon\Carbon        $updated_at
 * @property PollVote[]|Collection $votes
 * @property PollVote[]|Collection $myVotes
 */
class Poll extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    public $timestamps = true;
    /**
     * @var bool|mixed
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'end_date',
    ];

    /**
     * @param $question
     * @param $postId
     * @param $actorId
     * @param $endDate
     * @param $publicPoll
     *
     * @return static
     */
    public static function build($question, $postId, $actorId, $endDate, $publicPoll, $allowMultipleVotes = false, $maxVotes = 0)
    {
        $poll = new static();

        $poll->question = $question;
        $poll->post_id = $postId;
        $poll->user_id = $actorId;
        $poll->end_date = $endDate;
        $poll->public_poll = $publicPoll;
        $poll->allow_multiple_votes = $allowMultipleVotes;
        $poll->max_votes = $maxVotes;

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
    public function post()
    {
        return $this->belongsTo(Post::class);
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

    public function refreshVoteCount(): self
    {
        $this->vote_count = $this->votes()->count();

        return $this;
    }

    protected static $stateUser;

    public function myVotes(User $user = null)
    {
        $user = $user ?: static::$stateUser;

        return $this->votes()->where('user_id', $user ? $user->id : null);
    }

    public static function setStateUser(User $user)
    {
        static::$stateUser = $user;
    }
}
