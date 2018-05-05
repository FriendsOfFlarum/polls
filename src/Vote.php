<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls;

use Flarum\Database\AbstractModel;

class Vote extends AbstractModel
{
    /**
     * @var bool
     */
    public $timestamps = true;

    /**
     * @var string
     */
    protected $table = 'poll_votes';

    /**
     * @var array
     */
    protected $fillable = [
        'user_id',
        'option_id',
        'poll_id',
    ];

    /**
     * @var array
     */
    protected $visible = [
        'user_id',
        'option_id',
        'poll_id',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function poll()
    {
        // Create relationship between Vote and Question model to display poll data
        return $this->belongsTo(Question::class, 'poll_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function answer()
    {
        // Create relationship between Vote and Answer model to display answer
        return $this->belongsTo(Answer::class, 'option_id');
    }

    /**
     * @param $pollId
     * @param $userId
     * @param $optionId
     *
     * @return static
     */
    public static function build($pollId, $userId, $optionId)
    {
        $vote = new static();

        $vote->poll_id = $pollId;
        $vote->user_id = $userId;
        $vote->option_id = $optionId;

        return $vote;
    }
}
