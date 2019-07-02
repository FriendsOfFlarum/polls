<?php


namespace FoF\Polls;


use Flarum\Database\AbstractModel;
use Flarum\User\User;

/**
 * @property Poll $poll
 * @property PollOption $option
 * @property User $user
 * @property int $poll_id
 * @property int $option_id
 * @property int $user_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class PollVote extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    public $timestamps = true;

    /**
     * {@inheritdoc}
     */
    protected $dates = [
        'created_at',
        'updated_at',
    ];

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

    public function poll() {
        return $this->belongsTo(Poll::class);
    }

    public function option() {
        return $this->belongsTo(PollOption::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}