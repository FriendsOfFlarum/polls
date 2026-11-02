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

/**
 * Image URLs are derived from the stored filename without checking the disk, so serializing a
 * list of polls costs no storage round trips. Uploaded images therefore get a URL even when the
 * file is absent from the test disk.
 */
class PollImageUrlTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
            'polls' => [
                ['id' => 1, 'question' => 'Uploaded image', 'image' => 'pollimage-abcdef.png', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'allow_multiple_votes' => 0, 'max_votes' => 0, 'settings' => '{}', 'published_at' => '2021-01-01 00:00:00'],
                ['id' => 2, 'question' => 'External image', 'image' => 'https://example.com/cover.png', 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'allow_multiple_votes' => 0, 'max_votes' => 0, 'settings' => '{}', 'published_at' => '2021-01-01 00:00:00'],
                ['id' => 3, 'question' => 'No image', 'image' => null, 'post_id' => null, 'user_id' => 1, 'public_poll' => 0, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'allow_multiple_votes' => 0, 'max_votes' => 0, 'settings' => '{}', 'published_at' => '2021-01-01 00:00:00'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Uploaded', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'pollimage-hijklm.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 2, 'answer' => 'External', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => 'https://example.com/option.png', 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 3, 'answer' => 'Plain', 'poll_id' => 1, 'vote_count' => 0, 'image_url' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function listGlobalPolls(): array
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/polls', ['authenticatedAs' => 1])
                ->withQueryParams(['include' => 'options'])
        );

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * @test
     */
    public function poll_image_url_is_derived_from_the_filename_without_checking_the_disk()
    {
        $polls = collect($this->listGlobalPolls()['data'])->keyBy('id');

        $this->assertStringEndsWith('/pollimage-abcdef.png', $polls['1']['attributes']['imageUrl']);
        $this->assertSame('https://example.com/cover.png', $polls['2']['attributes']['imageUrl']);
        $this->assertNull($polls['3']['attributes']['imageUrl']);
    }

    /**
     * @test
     */
    public function option_image_url_is_derived_from_the_filename_without_checking_the_disk()
    {
        $options = collect($this->listGlobalPolls()['included'])
            ->where('type', 'poll_options')
            ->keyBy('id')
            ->map(fn (array $option) => $option['attributes']);

        $this->assertStringEndsWith('/pollimage-hijklm.png', $options['1']['imageUrl']);
        $this->assertTrue($options['1']['isImageUpload']);
        $this->assertSame('https://example.com/option.png', $options['2']['imageUrl']);
        $this->assertFalse($options['2']['isImageUpload']);
        $this->assertNull($options['3']['imageUrl']);
    }
}
