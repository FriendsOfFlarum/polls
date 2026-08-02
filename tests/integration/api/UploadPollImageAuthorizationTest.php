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

use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use Laminas\Diactoros\UploadedFile;
use PHPUnit\Framework\Attributes\Test;

/**
 * Uploading an image for a poll that does not exist yet — the composer flow,
 * where the image is uploaded before the poll is saved.
 *
 * That path used to assert `startPoll` with no model. `startPoll` is a policy
 * ability on Post, so with a null model core's Gate consults only GLOBAL
 * policies, finds nothing, and falls back to `hasPermission('startPoll')`.
 * No group can hold that — it isn't a registered permission — so the check
 * could only ever pass for admins: non-admins got a 403 when adding an image
 * to a poll while creating it (issue #131).
 */
class UploadPollImageAuthorizationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const UPLOADER_GROUP = 100;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2, Members — may start discussions + upload
                ['id' => 3, 'username' => 'nostart', 'email' => 'nostart@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => self::UPLOADER_GROUP, 'name_singular' => 'Uploader', 'name_plural' => 'Uploaders'],
            ],
            'group_user' => [
                ['user_id' => 2, 'group_id' => self::UPLOADER_GROUP],
                ['user_id' => 3, 'group_id' => self::UPLOADER_GROUP],
            ],
            'group_permission' => [
                // Both users may upload poll images, but only Members (user 2)
                // may actually start a poll in a discussion.
                ['group_id' => self::UPLOADER_GROUP, 'permission' => 'uploadPollImages'],
                ['group_id' => Group::MEMBER_ID, 'permission' => 'discussion.polls.start'],
                ['group_id' => Group::MEMBER_ID, 'permission' => 'discussion.startDiscussion'],
            ],
        ]);
    }

    /**
     * A real 1x1 PNG: the validator decodes the upload with Intervention, so a
     * dummy byte string won't do.
     */
    private function pngUpload(string $field = 'pollImage'): array
    {
        $path = tempnam(sys_get_temp_dir(), 'poll-image').'.png';

        $image = imagecreatetruecolor(1, 1);
        imagepng($image, $path);
        imagedestroy($image);

        return [$field => new UploadedFile($path, filesize($path), UPLOAD_ERR_OK, 'poll.png', 'image/png')];
    }

    private function upload(string $uri, int $actorId, string $field = 'pollImage'): int
    {
        return $this->send(
            $this->request('POST', $uri, ['authenticatedAs' => $actorId])
                ->withUploadedFiles($this->pngUpload($field))
        )->getStatusCode();
    }

    #[Test]
    public function a_non_admin_who_may_start_polls_can_upload_an_image_before_the_poll_exists()
    {
        // The reported case: user 2 holds uploadPollImages and
        // discussion.polls.start, and is composing a new discussion with a
        // poll. There is no poll id yet.
        $this->assertSame(200, $this->upload('/api/polls/pollImage', 2));
    }

    #[Test]
    public function a_non_admin_who_may_start_polls_can_upload_an_option_image_before_the_poll_exists()
    {
        $this->assertSame(200, $this->upload('/api/polls/pollOptionImage', 2, 'pollOptionImage'));
    }

    #[Test]
    public function an_admin_can_still_upload_before_the_poll_exists()
    {
        $this->assertSame(200, $this->upload('/api/polls/pollImage', 1));
    }

    #[Test]
    public function a_user_who_cannot_start_a_poll_anywhere_is_refused()
    {
        // discussion.polls.start is granted to Members by default, so revoke
        // it to model an actor who may upload poll images but has no poll they
        // could legitimately be creating one for.
        $this->database()->table('group_permission')
            ->where('permission', 'discussion.polls.start')
            ->delete();

        $this->assertSame(403, $this->upload('/api/polls/pollImage', 3));
    }
}
