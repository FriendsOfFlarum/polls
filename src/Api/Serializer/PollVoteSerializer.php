<?php


namespace FoF\Polls\Api\Serializer;


use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use FoF\Polls\PollVote;

class PollVoteSerializer extends AbstractSerializer
{
    /**
     * @var string
     */
    protected $type = 'poll_votes';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param PollVote $vote
     * @return array
     */
    protected function getDefaultAttributes($vote)
    {
        return [
            'created_at' => $this->formatDate($vote->created_at),
            'updated_at' => $this->formatDate($vote->updated_at),
        ];
    }

    public function poll($model) {
        return $this->hasOne(
            $model,
            PollSerializer::class
        );
    }

    public function option($model) {
        return $this->hasOne(
            $model,
            PollOptionSerializer::class,
        );
    }

    public function user($model) {
        return $this->hasOne(
            $model,
            BasicUserSerializer::class
        );
    }
}