<?php


namespace FoF\Polls;


use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property string $answer
 * @property Poll $poll
 * @property int $poll_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class PollOption extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    public $timestamps = true;

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    /**
     * @param $answer
     *
     * @return static
     */
    public static function build($answer)
    {
        $option = new static();

        $option->answer = $answer;

        return $option;
    }

    public function poll() {
        return $this->belongsTo(Poll::class);
    }

    public function votes() {
        return $this->hasMany(PollVote::class);
//            ->where('poll_id', $this->poll_id)
//            ->where('option_id', $this->id);
    }
}