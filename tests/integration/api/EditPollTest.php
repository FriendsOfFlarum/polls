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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;

class EditPollTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->setting('fof-polls.enableGlobalPolls', true);

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'polluser', 'email' => 'polluser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => 'Post 1', 'type' => 'comment'],
            ],
            'polls' => [
                ['id' => 1, 'question' => 'Testing Poll--Global', 'subtitle' => 'Testing subtitle', 'image' => 'pollimage-abcdef.png', 'image_alt' => 'test alt', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'allow_multiple_votes' => 0, 'max_votes' => 0, 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Option 1', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'pollimage-hijklm.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 2, 'answer' => 'Option 2', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'pollimage-nopqrs.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
            'group_user' => [
                ['user_id' => 4, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'discussion.polls.start', 'group_id' => 4],
                ['permission' => 'startGlobalPoll', 'group_id' => 4],
                ['permission' => 'uploadPollImages', 'group_id' => 4],
            ],
        ]);
    }

    /**
     * @test
     */
    public function user_without_permission_cannot_remove_pollimage_from_global_poll()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollImage/1', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_can_remove_pollimage_from_global_poll()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollImage/1', [
                'authenticatedAs' => 4,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_without_permission_cannot_remove_pollimage_by_name_from_global_poll()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollImage/name/pollimage-abcdef.png', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_can_remove_pollimage_by_name_from_global_poll()
    {
        $fileName = 'pollimage-abcdef.png';

        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollImage/name/'.$fileName, [
                'authenticatedAs' => 4,
            ])
        );

        // We need to expect a 404 because the file is not found in the filesystem under test.
        // TODO - improve this!
        $this->assertEquals(404, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_without_permission_cannot_remove_polloption_image_from_global_poll()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollOptionImage/1', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_can_remove_polloption_image_from_global_poll()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollOptionImage/1', [
                'authenticatedAs' => 4,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_without_permission_cannot_remove_polloption_image_by_name_from_global_poll()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollOptionImage/name/pollimage-hijklm.png', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_can_remove_polloption_image_by_name_from_global_poll()
    {
        $fileName = 'pollimage-hijklm.png';

        $response = $this->send(
            $this->request('DELETE', '/api/fof/polls/pollOptionImage/name/'.$fileName, [
                'authenticatedAs' => 4,
            ])
        );

        // We need to expect a 404 because the file is not found in the filesystem under test.
        // TODO - improve this!
        $this->assertEquals(404, $response->getStatusCode());
    }
}
