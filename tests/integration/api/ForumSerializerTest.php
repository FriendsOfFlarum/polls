<?php

namespace FoF\Polls\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;

class ForumSerializerTest extends TestCase
{
    use RetrievesAuthorizedUsers;
    
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'pollsuser', 'email' => 'polls@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => 1]
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 4]
            ],
            'group_permission' => [
                ['permission' => 'discussion.polls.start', 'group_id' => 4]
            ],
        ]);
    }

    /**
     * @test
     */
    public function guest_does_not_have_discussion_polls_start_permission()
    {
        $response = $this->send(
            $this->request('GET', '/api')
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents());

        $this->assertFalse($body->data->attributes->canStartPolls);
    }

    /**
     * @test
     */
    public function normal_user_does_not_have_discussion_polls_start_permission()
    {
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => 2
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents());

        $this->assertFalse($body->data->attributes->canStartPolls);
    }

    /**
     * @test
     */
    public function user_with_discussion_polls_start_permission_has_discussion_polls_start_permission()
    {
        $response = $this->send(
            $this->request('GET', '/api', [
                'authenticatedAs' => 3
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents());

        $this->assertTrue($body->data->attributes->canStartPolls);
    }
}
