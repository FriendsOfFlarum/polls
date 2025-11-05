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

use FoF\Polls\PollGroup;

class CreatePollGroupTest extends AbstractPollGroupTestCase
{
    /**
     * @test
     */
    public function authorized_user_can_create_poll_group()
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/fof/polls/groups',
                [
                    'authenticatedAs' => 3,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'name' => 'Test Poll Group',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $data = $json['data'];
        $attributes = $data['attributes'];

        $this->assertEquals('Test Poll Group', $attributes['name']);

        $pollGroupId = $data['id'];
        $this->assertNotNull($pollGroupId);

        $pollGroup = PollGroup::find($pollGroupId);
        $this->assertNotNull($pollGroup);
        $this->assertEquals(3, $pollGroup->user_id);
    }

    /**
     * @test
     */
    public function unauthorized_user_cannot_create_poll_group()
    {
        $response = $this->send(
            $this->request(
                'POST',
                '/api/fof/polls/groups',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'name' => 'Test Poll Group',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }
}
