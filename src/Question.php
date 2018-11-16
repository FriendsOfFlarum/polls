<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * https://reflar.redevs.org
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls;

use DateTime;
use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion;

class Question extends AbstractModel
{
    /**
     * @var bool
     */
    public $timestamps = true;

    /**
     * @var string
     */
    protected $table = 'polls';

    /**
     * @var array
     */
    protected $fillable = [
        'id',
        'discussion_id',
        'user_id',
    ];

    /**
     * @var array
     */
    protected $visible = [
        'question',
        'discussion_id',
    ];

    public function isEnded()
    {
        $endDate = new DateTime($this->end_date);
        if (new DateTime() > $endDate && $this->end_date !== '0000-00-00 00:00:00' && $this->end_date !== null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @return mixed
     */
    public function answers()
    {
        return $this->hasMany(Answer::class, 'poll_id')->orderBy('created_at', 'ASC');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function votes()
    {
        return $this->hasMany(Vote::class, 'poll_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function discussions()
    {
        return $this->belongsToMany(Discussion::class);
    }

    /**
     * @param $questionText
     * @param $discussionId
     * @param $actorId
     * @param $endDate
     * @param $publicPoll
     *
     * @return static
     */
    public static function build($questionText, $discussionId, $actorId, $endDate, $publicPoll)
    {
        $question = new static();

        $question->question = $questionText;
        $question->discussion_id = $discussionId;
        $question->user_id = $actorId;
        $question->end_date = $endDate;
        $question->public_poll = $publicPoll;

        return $question;
    }
}
