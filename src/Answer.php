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

class Answer extends AbstractModel
{
    /**
     * @var bool
     */
    public $timestamps = true;

    /**
     * @var string
     */
    protected $table = 'poll_options';

    /**
     * @var array
     */
    protected $fillable = [
        'answer',
        'poll_id',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'all_votes',
        'votes',
        'percent',
    ];

    /**
     * @return mixed
     */
    public function getAllVotesAttribute()
    {
        // Add all votes to data model
        $this->attributes['all_votes'] = Vote::where('poll_id', '=', $this->poll_id)->count();

        return $this->attributes['all_votes'];
    }

    /**
     * @return mixed
     */
    public function getVotesAttribute()
    {
        // Add votes to data model
        $this->attributes['votes'] = Vote::where('option_id', '=', $this->id)
            ->where('poll_id', '=', $this->poll_id)
            ->count();

        return $this->attributes['votes'];
    }

    /**
     * @return float|int
     */
    public function getPercentAttribute()
    {
        // Calculate percent of poll option (Votes / All Votes * 100)
        return $this->votes >= 1 ? round($this->votes / $this->all_votes * 100) : 0;
    }

    /**
     * @param $answerText
     * @return static
     */
    public static function build($answerText)
    {
        $answer = new static();

        $answer->answer = $answerText;

        return $answer;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function votes()
    {
        return $this->hasMany(Vote::class, 'option_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function poll()
    {
        return $this->belongsTo(Question::class, 'poll_id');
    }
}
