<?php

namespace FoF\Polls\Tests\integration\api;

use FoF\Polls\PollGroup;

class EditPollGroupTest extends AbstractPollGroupTestCase
{
    protected function getDefaultData(): array
    {
        return array_merge(parent::getDefaultData(), [
            'poll_groups' => [
                $this->getDefaultPollGroup(),
            ],
        ]);
    }

    /**
     * @test
     */
    public function authorized_user_can_edit_own_poll_group()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/polls/groups/1',
                [
                    'authenticatedAs' => 4,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'name' => 'Updated Group Name',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertEquals('Updated Group Name', $attributes['name']);

        $pollGroup = PollGroup::find(1);
        $this->assertEquals('Updated Group Name', $pollGroup->name);
    }

    /**
     * @test
     */
    public function authorized_moderator_user_can_edit_other_poll_group(){
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/polls/groups/1',
                [
                    'authenticatedAs' => 3,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'name' => 'Updated Group Name by User 3',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertEquals('Updated Group Name by User 3', $attributes['name']);

        $pollGroup = PollGroup::find(1);
        $this->assertEquals('Updated Group Name by User 3', $pollGroup->name);
    }

    /**
     * @test
     */
    public function unauthorized_user_cannot_edit_poll_group()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/polls/groups/1',
                [
                    'authenticatedAs' => 2,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'name' => 'Updated Group Name',
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());


        $pollGroup = PollGroup::find(1);
        $this->assertNotEquals('Updated Group Name', $pollGroup->name);
    }
}