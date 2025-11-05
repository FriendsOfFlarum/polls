<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\integration\api;

use FoF\Polls\Poll;
use FoF\Polls\PollGroup;

class DeletePollGroupTest extends AbstractPollGroupTestCase
{
    protected function getDefaultData(): array
    {
        return array_merge(parent::getDefaultData(), [
            'poll_groups' => [
                $this->getDefaultPollGroup(),
            ],
            'polls' => [
                $this->getDefaultPoll(),
            ],
        ]);
    }

    /**
     * @test
     */
    public function authorized_user_can_delete_poll_group()
    {
        $response = $this->send(
            $this->request(
                'DELETE',
                '/api/fof/polls/groups/1',
                [
                    'authenticatedAs' => 3,
                ]
            )
        );

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertNull(PollGroup::find(1));
    }

    /**
     * @test
     */
    public function unauthorized_user_cannot_delete_poll_group()
    {
        $response = $this->send(
            $this->request(
                'DELETE',
                '/api/fof/polls/groups/1',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertNotNull(PollGroup::find(1));
    }

    /**
     * @test
     */
    public function deleting_poll_group_cascades_to_polls()
    {
        $response = $this->send(
            $this->request(
                'DELETE',
                '/api/fof/polls/groups/1',
                [
                    'authenticatedAs' => 3,
                ]
            )
        );

        $this->assertEquals(204, $response->getStatusCode());

        // Check if poll_group_id is set to null for associated polls
        $poll = Poll::find(1);
        $this->assertNull($poll->poll_group_id);
    }
}
