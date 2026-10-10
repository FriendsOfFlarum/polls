<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\integration;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Polls\Poll;
use FoF\Polls\PollGroup;
use FoF\Polls\PollOption;
use FoF\Polls\PollVote;
use PHPUnit\Framework\Attributes\Test;

/**
 * Each model has a factory, so tests (here and in extensions that integrate
 * with polls) can seed only the columns they care about.
 */
class ModelFactoriesTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const DEFAULT_SETTINGS = [
        'public_poll'          => false,
        'allow_multiple_votes' => false,
        'max_votes'            => 0,
        'hide_votes'           => false,
        'allow_change_vote'    => true,
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');
    }

    private function settingsOf(int $pollId): array
    {
        return json_decode($this->database()->table('polls')->where('id', $pollId)->value('settings'), true);
    }

    #[Test]
    public function a_poll_seeded_through_its_factory_is_a_published_global_poll(): void
    {
        $this->prepareDatabase([
            User::class => [$this->normalUser()],
            Poll::class => [['id' => 1, 'user_id' => 2]],
        ]);

        $response = $this->send($this->request('GET', '/api/polls/1', ['authenticatedAs' => 2]));
        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $attributes = json_decode((string) $response->getBody(), true)['data']['attributes'];
        $this->assertNotEmpty($attributes['question']);
        $this->assertTrue($attributes['isGlobal']);
        $this->assertNotNull($attributes['publishedAt']);

        $this->assertEquals(self::DEFAULT_SETTINGS, $this->settingsOf(1));
        $this->assertSame(0, (int) $this->database()->table('polls')->where('id', 1)->value('vote_count'));
    }

    #[Test]
    public function partial_settings_are_merged_over_the_defaults(): void
    {
        $this->prepareDatabase([
            User::class => [$this->normalUser()],
            Poll::class => [['id' => 1, 'user_id' => 2, 'settings' => ['allow_change_vote' => false]]],
        ]);

        $this->app();

        $this->assertEquals(['allow_change_vote' => false] + self::DEFAULT_SETTINGS, $this->settingsOf(1));

        $poll = Poll::factory()->create(['user_id' => 2, 'settings' => ['public_poll' => true]]);
        $this->assertEquals(['public_poll' => true] + self::DEFAULT_SETTINGS, $this->settingsOf($poll->id));
    }

    #[Test]
    public function an_option_seeded_through_its_factory_belongs_to_a_poll(): void
    {
        $this->prepareDatabase([PollOption::class => [['id' => 1]]]);

        $this->app();

        $option = PollOption::query()->findOrFail(1);
        $this->assertNotEmpty($option->answer);
        $this->assertSame(0, (int) $option->vote_count);
        $this->assertNotNull(Poll::query()->find($option->poll_id));
    }

    #[Test]
    public function a_vote_seeded_through_its_factory_is_for_an_option_of_its_own_poll(): void
    {
        $this->prepareDatabase([PollVote::class => [['id' => 1]]]);

        $this->app();

        $vote = PollVote::query()->findOrFail(1);
        $this->assertSame($vote->poll_id, PollOption::query()->findOrFail($vote->option_id)->poll_id);
        $this->assertNotNull(User::query()->find($vote->user_id));
    }

    #[Test]
    public function a_poll_group_seeded_through_its_factory_has_an_owner(): void
    {
        $this->prepareDatabase([PollGroup::class => [['id' => 1]]]);

        $this->app();

        $group = PollGroup::query()->findOrFail(1);
        $this->assertNotEmpty($group->name);
        $this->assertNotNull(User::query()->find($group->user_id));
    }
}
