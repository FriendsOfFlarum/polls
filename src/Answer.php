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

use Carbon\Carbon;
use Flarum\Database\AbstractModel;

class Answer extends AbstractModel
{
    public $timestamps = true;

    protected $table = 'poll_options';

    protected $fillable = [
        'answer',
        'poll_id'
    ];

    protected $appends = [
        'all_votes',
        'votes',
        'percent'
    ];

    public function getAllVotesAttribute()
    {
        // Add all votes to data model
        $this->attributes['all_votes'] = Vote::where('poll_id', '=', $this->poll_id)->count();

        return $this->attributes['all_votes'];
    }

    public function getVotesAttribute()
    {
        // Add votes to data model
        $this->attributes['votes'] = Vote::where('option_id', '=', $this->id)
            ->where('poll_id', '=', $this->poll_id)
            ->count()
        ;

        return $this->attributes['votes'];
    }

    public function getPercentAttribute()
    {
        // Calculate percent of poll option (Votes / All Votes * 100)
        return $this->votes >= 1 ? round($this->votes / $this->all_votes * 100) : 0;
    }
}
