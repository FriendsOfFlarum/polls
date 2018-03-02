<?php

namespace Treefiction\Polls;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\Core\Discussion;

class Question extends AbstractModel
{

    public $timestamps = true;

    protected $table = 'polls';

    protected $fillable = ['id', 'discussion_id'];

    protected $visible = [
        'question',
        'discussion_id'
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class, 'poll_id');
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
