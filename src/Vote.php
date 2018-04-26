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
    public $timestamps = true;

    protected $table = 'poll_votes';

    protected $fillable = [
        'user_id',
        'option_id',
        'poll_id',
    ];

    protected $visible = [
        'user_id',
        'option_id',
        'poll_id',
    ];

    public function poll()
    {
        // Create relationship between Vote and Question model to display poll data
        return $this->belongsTo(Question::class, 'poll_id');
    }

    public static function build($pollId, $userId, $optionId)
    {
        $vote = new static();

        $vote->poll_id = $pollId;
        $vote->user_id = $userId;
        $vote->option_id = $optionId;

        return $vote;
    }
}
