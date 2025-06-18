<?php

namespace FoF\Polls\Commands;

use Flarum\User\User;
use FoF\Polls\Poll;
use FoF\Polls\PollGroup;
use Illuminate\Support\Arr;

trait PollGroupRelationTrait
{
    protected function setPollGroupRelationData(User $actor, ?Poll $poll, array $data):void
    {
        $pollGroupData = Arr::get($data, 'relationships.pollGroup.data', []);

        if (empty($pollGroupData)) {
            return;
        }

        $group = PollGroup::findOrFail($pollGroupData['id']);
        $actor->assertCan('edit', $group);

        if($poll) {
            $poll->pollGroup()->associate($group);
        }
    }
}