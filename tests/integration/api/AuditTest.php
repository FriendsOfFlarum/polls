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

use Flarum\Audit\AuditLog;
use Flarum\Audit\AuditLogger;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use Illuminate\Support\Arr;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\Yaml\Yaml;

/**
 * With flarum/audit enabled, poll and poll group changes and votes are logged.
 *
 * flarum/audit's own InteractsWithAuditLog helper is not in its released
 * package, so the few parts used here are inlined.
 */
class AuditTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const SETTINGS = '{"max_votes":0,"hide_votes":false,"public_poll":%s,"allow_change_vote":true,"allow_multiple_votes":false}';

    protected function setUp(): void
    {
        parent::setUp();

        // Lifecycle events fire outside the test transaction; keep them out of the log.
        AuditLogger::$testMode = true;

        $this->extension('flarum-audit', 'fof-polls');
        $this->setting('fof-polls.enableGlobalPolls', true);
        $this->setting('fof-polls.enablePollGroups', true);

        $date = '2021-01-01 00:00:00';
        $poll = fn (int $id, string $question, ?int $postId, bool $public = false, ?string $publishedAt = '2021-01-01 00:00:00') => [
            'id'         => $id, 'question' => $question, 'post_id' => $postId, 'user_id' => 1, 'end_date' => null, 'created_at' => $date, 'updated_at' => $date,
            'vote_count' => 0, 'published_at' => $publishedAt, 'settings' => sprintf(self::SETTINGS, $public ? 'true' : 'false'),
        ];
        $option = fn (int $id, int $pollId) => ['id' => $id, 'answer' => "Option $id", 'poll_id' => $pollId, 'vote_count' => 0, 'created_at' => $date, 'updated_at' => $date];

        $this->prepareDatabase([
            'audit_log'       => [],
            User::class       => [$this->normalUser()],
            Discussion::class => [
                ['id' => 1, 'title' => 'Discussion 1', 'comment_count' => 1, 'participant_count' => 1, 'created_at' => $date, 'user_id' => 1, 'first_post_id' => 1],
            ],
            Post::class => [
                ['id' => 1, 'user_id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $date, 'content' => '<t><p>Post 1</p></t>', 'type' => 'comment'],
            ],
            'polls' => [
                $poll(1, 'Global poll', null),
                $poll(2, 'Public poll', null, true),
                $poll(3, 'Draft poll', null, false, null),
                $poll(4, 'Discussion poll', 1),
            ],
            'poll_options' => [$option(1, 1), $option(2, 1), $option(3, 2), $option(4, 2), $option(5, 3), $option(6, 3), $option(7, 4), $option(8, 4)],
            'poll_groups'  => [['id' => 1, 'name' => 'Group', 'user_id' => 1, 'created_at' => $date, 'updated_at' => $date]],
        ]);
    }

    private function sendSuccessfulRequest(string $method, string $path, array $json, int $status): ResponseInterface
    {
        $response = $this->send($this->request($method, $path, ['authenticatedAs' => 1, 'json' => $json]));

        $this->assertSame($status, $response->getStatusCode(), (string) $response->getBody());

        return $response;
    }

    private function idFrom(ResponseInterface $response): int
    {
        return (int) json_decode((string) $response->getBody(), true)['data']['id'];
    }

    private function assertLogged(string $action, array $payload, int $skip = 0): void
    {
        /** @var AuditLog|null $log */
        $log = AuditLog::query()->where('action', $action)->orderBy('id')->skip($skip)->first();

        $this->assertNotNull($log, "Logged $action");
        $this->assertEquals($payload, $log->payload, "Payload of $action");
        $this->assertSame(1, (int) $log->actor_id, "Actor of $action");
        $this->assertSame('127.0.0.1', $log->ip_address, "IP of $action");
    }

    private static function pollAttributes(string $question): array
    {
        return [
            'question'           => $question,
            'publicPoll'         => false,
            'hideVotes'          => false,
            'allowChangeVote'    => true,
            'allowMultipleVotes' => false,
            'maxVotes'           => 0,
            'endDate'            => false,
            'options'            => [['answer' => 'Red'], ['answer' => 'Blue']],
        ];
    }

    private function vote(int $pollId, int $optionId): void
    {
        $this->sendSuccessfulRequest('PATCH', "/api/polls/$pollId/votes", ['data' => ['optionIds' => [$optionId]]], 200);
    }

    #[Test]
    public function every_logged_action_is_registered_with_a_label_for_the_audit_browser(): void
    {
        $this->app();

        $actions = AuditLogger::$registeredActions['fof-polls'] ?? [];

        $this->assertEqualsCanonicalizing([
            'poll.created', 'poll.updated', 'poll.deleted', 'poll.published', 'poll.unpublished', 'poll.voted',
            'poll_group.created', 'poll_group.updated', 'poll_group.deleted',
        ], $actions);

        // Extension locales aren't loaded in integration tests, so read the file.
        $labels = Yaml::parseFile(__DIR__.'/../../../resources/locale/en.yml')['flarum-audit']['lib']['browser'] ?? [];

        foreach ($actions as $action) {
            $this->assertIsString(Arr::get($labels, $action), "Label for $action");
        }
    }

    #[Test]
    public function creating_a_global_poll_is_logged(): void
    {
        $id = $this->idFrom($this->sendSuccessfulRequest('POST', '/api/polls', ['data' => ['type' => 'polls', 'attributes' => self::pollAttributes('Colour?')]], 201));

        $this->assertLogged('poll.created', ['poll_id' => $id, 'title' => 'Colour?']);
    }

    #[Test]
    public function creating_a_poll_with_a_post_is_logged_with_its_discussion(): void
    {
        $postId = $this->idFrom($this->sendSuccessfulRequest('POST', '/api/posts', ['data' => [
            'attributes'    => ['content' => 'A reply with a poll', 'poll' => self::pollAttributes('Colour?')],
            'relationships' => ['discussion' => ['data' => ['type' => 'discussions', 'id' => '1']]],
        ]], 201));

        $pollId = (int) Post::query()->findOrFail($postId)->polls()->value('id');

        $this->assertLogged('poll.created', ['poll_id' => $pollId, 'title' => 'Colour?', 'discussion_id' => 1, 'post_id' => $postId]);
    }

    #[Test]
    public function editing_a_poll_is_logged(): void
    {
        $this->sendSuccessfulRequest('PATCH', '/api/polls/1', ['data' => ['type' => 'polls', 'id' => '1', 'attributes' => ['question' => 'Edited poll']]], 200);

        $this->assertLogged('poll.updated', ['poll_id' => 1, 'title' => 'Edited poll']);
    }

    #[Test]
    public function deleting_a_poll_is_logged(): void
    {
        $this->sendSuccessfulRequest('DELETE', '/api/polls/1', [], 204);

        $this->assertLogged('poll.deleted', ['poll_id' => 1, 'title' => 'Global poll']);
    }

    #[Test]
    public function publishing_and_unpublishing_a_poll_are_logged(): void
    {
        $this->sendSuccessfulRequest('POST', '/api/polls/3/publish', [], 200);
        $this->sendSuccessfulRequest('POST', '/api/polls/1/unpublish', [], 200);

        $this->assertLogged('poll.published', ['poll_id' => 3, 'title' => 'Draft poll']);
        $this->assertLogged('poll.unpublished', ['poll_id' => 1, 'title' => 'Global poll']);
    }

    #[Test]
    public function a_vote_in_a_private_poll_is_logged_without_the_choice(): void
    {
        $this->vote(1, 1);

        $this->assertLogged('poll.voted', ['poll_id' => 1, 'title' => 'Global poll']);
    }

    #[Test]
    public function a_vote_in_a_public_poll_is_logged_with_the_choice_and_its_change(): void
    {
        $this->vote(2, 3);
        $this->vote(2, 4);

        $this->assertLogged('poll.voted', ['poll_id' => 2, 'title' => 'Public poll', 'added_option_ids' => [3], 'removed_option_ids' => []]);
        $this->assertLogged('poll.voted', ['poll_id' => 2, 'title' => 'Public poll', 'added_option_ids' => [4], 'removed_option_ids' => [3]], 1);
    }

    #[Test]
    public function a_vote_in_a_discussion_poll_is_logged_with_its_discussion(): void
    {
        $this->vote(4, 7);

        $this->assertLogged('poll.voted', ['poll_id' => 4, 'title' => 'Discussion poll', 'discussion_id' => 1, 'post_id' => 1]);
    }

    #[Test]
    public function resubmitting_the_same_vote_is_not_logged_again(): void
    {
        $this->vote(1, 1);
        $this->vote(1, 1);

        $this->assertSame(1, AuditLog::query()->where('action', 'poll.voted')->count());
    }

    #[Test]
    public function creating_editing_and_deleting_a_poll_group_are_logged(): void
    {
        $id = $this->idFrom($this->sendSuccessfulRequest('POST', '/api/poll_groups', ['data' => ['type' => 'poll_groups', 'attributes' => ['name' => 'New group']]], 201));
        $this->sendSuccessfulRequest('PATCH', '/api/poll_groups/1', ['data' => ['type' => 'poll_groups', 'id' => '1', 'attributes' => ['name' => 'Renamed group']]], 200);
        $this->sendSuccessfulRequest('DELETE', '/api/poll_groups/1', [], 204);

        $this->assertLogged('poll_group.created', ['poll_group_id' => $id, 'name' => 'New group']);
        $this->assertLogged('poll_group.updated', ['poll_group_id' => 1, 'name' => 'Renamed group']);
        $this->assertLogged('poll_group.deleted', ['poll_group_id' => 1, 'name' => 'Renamed group']);
    }
}
