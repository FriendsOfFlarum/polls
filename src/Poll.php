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
 * @property int                   $vote_count
 * @property Post                  $post
 * @property User                  $user
 * @property int|null              $post_id
 * @property int                   $user_id
 * @property \Carbon\Carbon|null   $end_date
 * @property \Carbon\Carbon|null   $published_at
 * @property \Carbon\Carbon|null   $scheduled_publish_at
 * @property string|null           $scheduled_publish_error
 * @property \Carbon\Carbon        $created_at
 * @property \Carbon\Carbon        $updated_at
 * @property PollSettings          $settings
 * @property PollVote[]|Collection $votes
 * @property PollVote[]|Collection $myVotes
 * @property string|null           $image
 * @property string|null           $image_alt
 *
 *  @phpstan-type PollSettings     array{'public_poll': bool, 'allow_multiple_votes': bool, 'max_votes': int, 'allow_change_vote' : bool}
 */
class Poll extends AbstractModel
{
    use ScopeVisibilityTrait;

    /**
     * {@inheritdoc}
     */
    public $timestamps = true;

    protected $dateFormat = 'Y-m-d H:i:s';

    protected $casts = [
        'settings'             => AsArrayObject::class,
        'created_at'           => 'datetime',
        'updated_at'           => 'datetime',
        'end_date'             => 'datetime',
        'published_at'         => 'datetime',
        'scheduled_publish_at' => 'datetime',
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
    public static function build(string $question, ?int $postId, int $actorId, ?\Carbon\Carbon $endDate, mixed $publicPoll, mixed $allowMultipleVotes = false, mixed $maxVotes = 0, mixed $hideVotes = false, mixed $allowChangeVote = true, ?string $subtitle = null, ?string $imageFilename = null, ?string $imageAlt = null, ?\Carbon\Carbon $publishedAt = null): static
    {
        $poll = new static();

        $poll->question = $question;
        $poll->subtitle = $subtitle;
        $poll->image = $imageFilename;
        $poll->image_alt = $imageAlt;
        $poll->post_id = $postId;
        $poll->user_id = $actorId;
        $poll->end_date = $endDate;
        $poll->published_at = $publishedAt;
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

    public function isDraft(): bool
    {
        return $this->isGlobal() && $this->published_at === null;
    }

    public function isScheduled(): bool
    {
        return $this->isDraft() && $this->scheduled_publish_at !== null;
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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pollGroup()
    {
        return $this->belongsTo(PollGroup::class);
    }

    public function refreshVoteCount(): self
    {
        $this->vote_count = $this->votes()->count();

        return $this;
    }

    protected static ?User $stateUser = null;

    public function myVotes(?User $user = null): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        $user = $user ?: static::$stateUser;

        return $this->votes()->where('user_id', $user ? $user->id : null);
    }

    public static function setStateUser(User $user): void
    {
        static::$stateUser = $user;
    }

    protected function getPublicPollAttribute(): bool
    {
        return (bool) Arr::get($this->settings, 'public_poll');
    }

    protected function getAllowMultipleVotesAttribute(): bool
    {
        return (bool) Arr::get($this->settings, 'allow_multiple_votes');
    }

    protected function getMaxVotesAttribute(): int
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

    public function delete()
    {
        if ($this->image && !filter_var($this->image, FILTER_VALIDATE_URL)) {
            resolve(PollImageUploader::class)->deleteAllVariants($this->image);
        }

        return parent::delete();
    }
}
