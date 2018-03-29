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

use Flarum\Core\Discussion;
use Flarum\Database\AbstractModel;

class Question extends AbstractModel
{
    public $timestamps = true;

    protected $table = 'polls';

    protected $fillable = [
        'id',
        'discussion_id',
        'user_id',
    ];

    protected $visible = [
        'question',
        'discussion_id',
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class, 'poll_id')->orderBy('created_at', 'ASC');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'poll_id');
    }

    public function discussions()
    {
        return $this->belongsToMany(Discussion::class);
    }
}
