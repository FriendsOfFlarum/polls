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
use FoF\Polls\PollVote;
use FoF\Polls\Tests\integration\InspectsQueries;
use PHPUnit\Framework\Attributes\Test;

/**
 * Recounting votes after a vote: one grouped count for every option the vote
 * changed, and the counts pushed to other viewers are the new ones.
 */
class VoteRecountTest extends TestCase
{
    use InspectsQueries;
    use RetrievesAuthorizedUsers;

    /**
     * Below the repeated-query detector's threshold, which the vote's own
     * one-insert-per-chosen-option would otherwise trip.
     */
    private const OPTION_COUNT = 4;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');

        $options = [];

        for ($id = 1; $id <= self::OPTION_COUNT; $id++) {
            $options[] = ['id' => $id, 'answer' => "Option $id", 'poll_id' => 1, 'vote_count' => $id === 1 ? 1 : 0];
        }

        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Poll::class       => [['id' => 1, 'question' => 'Pick any', 'user_id' => 1, 'vote_count' => 1, 'settings' => ['allow_multiple_votes' => true, 'max_votes' => 0]]],
            PollOption::class => $options,
            // The admin already chose option 1.
            PollVote::class    => [['id' => 1, 'poll_id' => 1, 'option_id' => 1, 'user_id' => 1]],
            'group_permission' => [['permission' => 'discussion.polls.vote', 'group_id' => 3]],
        ]);
    }

    private function voteForEveryOption(): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/polls/1/votes', [
                'authenticatedAs' => 2,
                'json'            => ['data' => ['optionIds' => range(1, self::OPTION_COUNT)]],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());
    }

    #[Test]
    public function the_changed_options_are_recounted_in_one_query()
    {
        $counts = array_values(array_filter(
            $this->queriesDuring(fn () => $this->voteForEveryOption()),
            fn (string $sql) => $this->selectsFrom($sql) === 'poll_votes' && stripos($sql, 'count(') !== false
        ));

        // One for the poll's total, one for every changed option.
        $this->assertLessThanOrEqual(2, count($counts), 'Votes were counted '.count($counts)." times:\n".implode("\n", $counts));

        $this->assertSame([1 => 2, 2 => 1, 3 => 1, 4 => 1], array_map('intval', PollOption::query()->where('poll_id', 1)->pluck('vote_count', 'id')->all()));
        $this->assertSame(5, (int) Poll::query()->find(1)->vote_count);
    }

    #[Test]
    public function other_viewers_are_pushed_the_new_counts()
    {
        $pusher = new class() {
            public array $triggered = [];

            public function trigger(string $channel, string $event, array $data): void
            {
                $this->triggered[] = compact('channel', 'event', 'data');
            }
        };

        // The handler pushes only when a Pusher class exists.
        class_alias(get_class($pusher), 'Pusher');
        $this->app()->getContainer()->instance('Pusher', $pusher);

        $this->voteForEveryOption();

        $this->assertCount(1, $pusher->triggered);
        $this->assertSame('updatedPollOptions', $pusher->triggered[0]['event']);
        $this->assertSame(5, (int) $pusher->triggered[0]['data']['pollVoteCount']);
        $this->assertSame([1 => 2, 2 => 1, 3 => 1, 4 => 1], array_map('intval', $pusher->triggered[0]['data']['options']));
    }
}
