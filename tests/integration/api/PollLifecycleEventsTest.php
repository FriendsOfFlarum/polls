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

use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Polls\Events\PollWasCreated;
use FoF\Polls\Events\PollWasDeleted;
use FoF\Polls\Events\PollWasEdited;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use PHPUnit\Framework\Attributes\Test;

/**
 * Listeners to a poll's lifecycle events see the poll as it was saved: its
 * options in place on creation and on edit, and the row gone on deletion.
 */
class PollLifecycleEventsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    /** @var array<int, array{event: class-string, pollId: int, actorId: int|null, question: string|null, options: string[], exists: bool, data?: array}> */
    private static array $recorded = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-polls');
        $this->setting('fof-polls.enableGlobalPolls', true);

        self::$recorded = [];

        $this->extend(
            (new Extend\Event())
                ->listen(PollWasCreated::class, fn (PollWasCreated $event) => self::record($event))
                ->listen(PollWasEdited::class, fn (PollWasEdited $event) => self::record($event, ['data' => $event->data]))
                ->listen(PollWasDeleted::class, fn (PollWasDeleted $event) => self::record($event))
        );

        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Discussion::class => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => '2021-01-01 00:00:00', 'user_id' => 1, 'first_post_id' => 1],
            ],
            Post::class => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => '2021-01-01 00:00:00', 'content' => '<t><p>Post 1</p></t>', 'type' => 'comment'],
            ],
            'polls' => [
                ['id' => 1, 'question' => 'Global poll', 'post_id' => null, 'user_id' => 1, 'end_date' => null, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00', 'vote_count' => 0, 'published_at' => '2021-01-01 00:00:00', 'settings' => '{"max_votes":0,"hide_votes":false,"public_poll":false,"allow_change_vote":true,"allow_multiple_votes":false}'],
            ],
            'poll_options' => [
                ['id' => 1, 'answer' => 'Option 1', 'poll_id' => 1, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
                ['id' => 2, 'answer' => 'Option 2', 'poll_id' => 1, 'vote_count' => 0, 'created_at' => '2021-01-01 00:00:00', 'updated_at' => '2021-01-01 00:00:00'],
            ],
        ]);
    }

    private static function record(object $event, array $extra = []): void
    {
        $pollId = $event->poll->id;

        self::$recorded[] = [
            'event'    => $event::class,
            'pollId'   => $pollId,
            'actorId'  => $event->actor?->id,
            'question' => Poll::query()->whereKey($pollId)->value('question'),
            'options'  => PollOption::query()->where('poll_id', $pollId)->orderBy('id')->pluck('answer')->all(),
            'exists'   => Poll::query()->whereKey($pollId)->exists(),
        ] + $extra;
    }

    private static function pollAttributes(string $question, array $answers): array
    {
        return [
            'question'           => $question,
            'publicPoll'         => false,
            'hideVotes'          => false,
            'allowChangeVote'    => true,
            'allowMultipleVotes' => false,
            'maxVotes'           => 0,
            'endDate'            => false,
            'options'            => array_map(fn (string $answer) => ['answer' => $answer], $answers),
        ];
    }

    #[Test]
    public function creating_a_global_poll_announces_it_with_its_options_saved(): void
    {
        $response = $this->send($this->request('POST', '/api/polls', [
            'authenticatedAs' => 1,
            'json'            => ['data' => ['type' => 'polls', 'attributes' => self::pollAttributes('Colour?', ['Red', 'Blue'])]],
        ]));

        $this->assertSame(201, $response->getStatusCode(), (string) $response->getBody());

        $this->assertCount(1, self::$recorded);
        $this->assertSame(PollWasCreated::class, self::$recorded[0]['event']);
        $this->assertSame(1, self::$recorded[0]['actorId']);
        $this->assertSame(['Red', 'Blue'], self::$recorded[0]['options']);
    }

    #[Test]
    public function creating_a_poll_with_a_post_announces_it_with_its_options_saved(): void
    {
        $response = $this->send($this->request('POST', '/api/posts', [
            'authenticatedAs' => 1,
            'json'            => ['data' => [
                'attributes'    => ['content' => 'A reply with a poll', 'poll' => self::pollAttributes('Colour?', ['Red', 'Blue'])],
                'relationships' => ['discussion' => ['data' => ['type' => 'discussions', 'id' => '1']]],
            ]],
        ]));

        $this->assertSame(201, $response->getStatusCode(), (string) $response->getBody());

        $this->assertCount(1, self::$recorded);
        $this->assertSame(PollWasCreated::class, self::$recorded[0]['event']);
        $this->assertSame(['Red', 'Blue'], self::$recorded[0]['options']);
    }

    #[Test]
    public function editing_a_poll_announces_it_with_its_options_saved(): void
    {
        $response = $this->send($this->request('PATCH', '/api/polls/1', [
            'authenticatedAs' => 1,
            'json'            => ['data' => ['type' => 'polls', 'id' => '1', 'attributes' => [
                'question' => 'Edited poll',
                'options'  => [
                    ['id' => 1, 'attributes' => ['answer' => 'Option 1, edited']],
                    ['attributes' => ['answer' => 'Option 3']],
                ],
            ]]],
        ]));

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $this->assertCount(1, self::$recorded);
        $this->assertSame(PollWasEdited::class, self::$recorded[0]['event']);
        $this->assertSame([1, 1], [self::$recorded[0]['pollId'], self::$recorded[0]['actorId']]);
        $this->assertSame('Edited poll', self::$recorded[0]['question']);
        $this->assertSame(['Option 1, edited', 'Option 3'], self::$recorded[0]['options']);
        $this->assertSame('Edited poll', self::$recorded[0]['data']['attributes']['question'] ?? null);
    }

    #[Test]
    public function deleting_a_poll_announces_it_once_it_is_gone(): void
    {
        $response = $this->send($this->request('DELETE', '/api/polls/1', ['authenticatedAs' => 1]));

        $this->assertSame(204, $response->getStatusCode(), (string) $response->getBody());

        $this->assertCount(1, self::$recorded);
        $this->assertSame(PollWasDeleted::class, self::$recorded[0]['event']);
        $this->assertSame([1, 1], [self::$recorded[0]['pollId'], self::$recorded[0]['actorId']]);
        $this->assertFalse(self::$recorded[0]['exists']);
    }
}
