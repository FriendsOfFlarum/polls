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
use Flarum\User\User;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use PHPUnit\Framework\Attributes\Test;

/**
 * The image delete endpoints only checked the global `uploadPollImages`
 * permission, never whether the actor may edit the poll the image belongs to —
 * unlike the upload endpoints, which do. Any user holding `uploadPollImages`
 * could therefore clear the image of a poll owned by someone else, by id or by
 * filename (poll ids are sequential and image filenames are public in poll
 * payloads).
 */
class DeletePollImageAuthorizationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->setting('fof-polls.enableGlobalPolls', true);

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'pollowner', 'email' => 'pollowner@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'otheruser', 'email' => 'otheruser@machine.local', 'password' => 'too-obscure', 'is_email_confirmed' => true],
            ],
            'polls' => [
                ['id' => 1, 'question' => 'Owned by user 3', 'post_id' => null, 'user_id' => 3, 'end_date' => null, 'image' => 'pollImage-owned.webp', 'image_alt' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'published_at' => '2021-01-01 00:00:00', 'settings' => '{"max_votes": 0,"hide_votes": false,"public_poll": false,"allow_change_vote": false,"allow_multiple_votes": false}'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Option 1', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'pollImage-option.webp', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 4],
                ['user_id' => 4, 'group_id' => 4],
            ],
            'group_permission' => [
                // Both users may upload poll images and edit their *own* polls.
                // Only user 3 owns the fixture poll, so only user 3 may touch it.
                ['permission' => 'uploadPollImages', 'group_id' => 4],
                ['permission' => 'polls.selfEdit', 'group_id' => 4],
            ],
        ]);
    }

    #[Test]
    public function user_cannot_delete_another_users_poll_image_by_id()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollImage/1', ['authenticatedAs' => 4])
        );

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertEquals('pollImage-owned.webp', Poll::find(1)->image);
    }

    #[Test]
    public function user_cannot_delete_another_users_poll_image_by_name()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollImage/name/pollImage-owned.webp', ['authenticatedAs' => 4])
        );

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertEquals('pollImage-owned.webp', Poll::find(1)->image);
    }

    #[Test]
    public function user_cannot_delete_another_users_option_image_by_id()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollOptionImage/1', ['authenticatedAs' => 4])
        );

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertEquals('pollImage-option.webp', PollOption::find(1)->image_url);
    }

    #[Test]
    public function poll_owner_can_still_delete_their_own_poll_image()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollImage/1', ['authenticatedAs' => 3])
        );

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertNull(Poll::find(1)->image);
    }

    #[Test]
    public function poll_owner_can_still_delete_their_own_option_image()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollOptionImage/1', ['authenticatedAs' => 3])
        );

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertNull(PollOption::find(1)->image_url);
    }

    #[Test]
    public function deleting_an_unknown_poll_image_is_not_found_rather_than_a_server_error()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollImage/999', ['authenticatedAs' => 3])
        );

        $this->assertEquals(404, $response->getStatusCode());
    }

    #[Test]
    public function an_unreferenced_filename_can_still_be_cleaned_up()
    {
        // The by-name endpoint exists so the client can remove an image it just
        // uploaded for a poll that was never saved. A name attached to no poll
        // stays deletable by anyone who may upload images.
        $response = $this->send(
            $this->request('DELETE', '/api/polls/pollImage/name/pollImage-orphan.webp', ['authenticatedAs' => 4])
        );

        $this->assertEquals(204, $response->getStatusCode());
    }
}
