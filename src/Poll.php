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
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Post\Post;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;

/**
 * @property int         $id
 * @property string      $question
 * @property string|null $subtitle
 * @property-read bool             $public_poll
 * @property-read bool             $allow_multiple_votes
 * @property-read int              $max_votes
 * @property-read bool             $hide_votes
 * @property-read bool             $allow_change_vote
 * @property int                   $vote_count
 * @property Post                  $post
 * @property User                  $user
 * @property int|null              $post_id
 * @property int                   $user_id
 * @property \Carbon\Carbon|null   $end_date
 * @property \Carbon\Carbon        $created_at
 * @property \Carbon\Carbon        $updated_at
 * @property PollSettings          $settings
 * @property PollVote[]|Collection $votes
 * @property PollVote[]|Collection $myVotes
 * @property string|null           $image
 *
 *  @phpstan-type PollSettings     array{'public_poll': bool, 'allow_multiple_votes': bool, 'max_votes': int}
 */
class Poll extends AbstractModel
{
    use ScopeVisibilityTrait;

    /**
     * {@inheritdoc}
     */
    public $timestamps = true;

    protected $casts = [
        'settings'   => AsArrayObject::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'end_date'   => 'datetime',
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
    public static function build($question, $postId, $actorId, $endDate, $publicPoll, $allowMultipleVotes = false, $maxVotes = 0, $hideVotes = false, $allowChangeVote = true, $subtitle = null, $imageFilename = null)
    {
        $poll = new static();

        $poll->question = $question;
        $poll->subtitle = $subtitle;
        $poll->image = $imageFilename;
        $poll->post_id = $postId;
        $poll->user_id = $actorId;
        $poll->end_date = $endDate;
        $poll->settings = [
            'public_poll'          => $publicPoll,
            'allow_multiple_votes' => $allowMultipleVotes,
            'max_votes'            => min(0, (int) $maxVotes),
            'hide_votes'           => $hideVotes,
            'allow_change_vote'    => $allowChangeVote,
        ];

        return $poll;
    }

    public function isGlobal(): bool
    {
        return $this->post_id === null;
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

    protected function getPublicPollAttribute()
    {
        return (bool) Arr::get($this->settings, 'public_poll');
    }

    protected function getAllowMultipleVotesAttribute()
    {
        return (bool) Arr::get($this->settings, 'allow_multiple_votes');
    }

    protected function getMaxVotesAttribute()
    {
        return (int) Arr::get($this->settings, 'max_votes');
    }

    protected function getHideVotesAttribute(): bool
    {
        return (bool) Arr::get($this->settings, 'hide_votes');
    }

    protected function getAllowChangeVoteAttribute(): bool
    {
        return (bool) Arr::get($this->settings, 'allow_change_vote', true);
    }
}
