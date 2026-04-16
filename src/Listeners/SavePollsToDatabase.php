<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Listeners;

use Flarum\Foundation\ValidationException;
use Flarum\Post\Event\Saving;
use FoF\Polls\Commands\CreatePoll;
use Symfony\Contracts\Translation\TranslatorInterface;

class SavePollsToDatabase
{
    /**
     * Poll data stashed from the DiscussionResource's poll field set() callback.
     * In Flarum 2.x, when creating a discussion, the DiscussionResource creates
     * the first post internally and only passes 'content' to the PostResource —
     * the poll data from the original request is lost in transit. The Discussion's
     * poll field set() callback stores it here so this listener can pick it up.
     */
    public static ?array $pendingPollData = null;

    public function __construct(protected \Flarum\Bus\Dispatcher $bus, protected TranslatorInterface $translator)
    {
    }

    public function handle(Saving $event)
    {
        if ($event->post->exists) {
            return;
        }

        $pollData = $event->data['attributes']['poll'] ?? null;

        if ($pollData === null) {
            $pollData = static::$pendingPollData;
            static::$pendingPollData = null;
        }

        if ($pollData === null) {
            return;
        }

        // 'assertCan' throws a generic no permission error, but we want to be more specific.
        if ($event->actor->cannot('startPoll', $event->post)) {
            throw new ValidationException([
                'poll' => $this->translator->trans('fof-polls.forum.composer_discussion.no_permission_alert'),
            ]);
        }

        $attributes = (array) $pollData;

        $this->bus->dispatch(
            new CreatePoll(
                $event->actor,
                $event->post,
                [
                    'attributes' => $attributes,
                ],
                function (callable $callback) use ($event) {
                    $event->post->afterSave($callback);
                }
            )
        );
    }
}
