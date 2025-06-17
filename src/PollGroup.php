<?php

namespace FoF\Polls;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;

/**
 * @property int $id
 * @property string $name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property int $user_id
 *
 * @property \Flarum\User\User $user
 * @property \FoF\Polls\Poll[] $polls
 */
class PollGroup extends AbstractModel
{
    use ScopeVisibilityTrait;

    public $timestamps = true;

    protected $table = 'poll_groups';

    protected $fillable = ['name'];

    public function polls()
    {
        return $this->hasMany(Poll::class, 'poll_group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}