<?php

namespace Treefiction\Polls;

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
        'percent
    '];

    public function getAllVotesAttribute()
    {
        return $this->attributes['all_votes'] = Vote::where('poll_id', '=', $this->poll_id)->count();
    }

    public function getVotesAttribute()
    {
        return $this->attributes['votes'] = Vote::where('option_id', '=', $this->id)
            ->where('poll_id', '=', $this->poll_id)
            ->count()
        ;
    }

    public function getPercentAttribute()
    {
        return $this->votes >= 1 ? round($this->votes / $this->all_votes * 100) : 0;
    }
}
