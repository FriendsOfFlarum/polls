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
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Contracts\Translation\TranslatorInterface;

class SavePollsToDatabase
{
    /**
     * @var \Flarum\Bus\Dispatcher
     */
    protected $bus;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    public function __construct(\Flarum\Bus\Dispatcher $bus, TranslatorInterface $translator)
    {
        $this->bus = $bus;
        $this->translator = $translator;
    }

    public function handle(Saving $event)
    {
        if ($event->post->exists || !isset($event->data['attributes']['poll'])) {
            return;
        }

        // 'assertCan' throws a generic no permission error, but we want to be more specific.
        // There are a lot of different reasons why a user might not be able to post a discussion.
        if ($event->actor->cannot('startPoll', $event->post)) {

            throw new ValidationException([
                'poll' => $this->translator->trans('fof-polls.forum.composer_discussion.no_permission_alert'),
            ]);
        }

        $attributes = (array) $event->data['attributes']['poll'];

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
