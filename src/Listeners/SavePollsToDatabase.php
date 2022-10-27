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

use Carbon\Carbon;
use Flarum\Discussion\Event\Saving;
use FoF\Polls\Events\PollWasCreated;
use FoF\Polls\Events\SavingPollAttributes;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class SavePollsToDatabase
{
    /**
     * @var PollValidator
     */
    protected $validator;

    /**
     * @var PollOptionValidator
     */
    protected $optionValidator;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * SavePollToDatabase constructor.
     *
     * @param Dispatcher          $events
     * @param PollValidator       $validator
     * @param PollOptionValidator $optionValidator
     */
    public function __construct(PollValidator $validator, PollOptionValidator $optionValidator, Dispatcher $events)
    {
        $this->validator = $validator;
        $this->optionValidator = $optionValidator;
        $this->events = $events;
    }

    public function handle(Saving $event)
    {
        if ($event->discussion->exists || !isset($event->data['attributes']['poll'])) {
            return;
        }

        $event->actor->assertCan('startPolls');

        $attributes = (array) $event->data['attributes']['poll'];

        // Ideally we would use some JSON:API relationship syntax, but it's just too complicated with Flarum to generate the correct JSON payload
        // Instead we just pass an array of option objects that are each a set of key-value pairs for the option attributes
        // This is also the same syntax that always used by EditPollHandler
        $rawOptionsData = Arr::get($attributes, 'options');

        $optionsData = [];

        if (is_array($rawOptionsData)) {
            foreach ($rawOptionsData as $rawOptionData) {
                $optionsData[] = [
                    'answer'   => Arr::get($rawOptionData, 'answer'),
                    'imageUrl' => Arr::get($rawOptionData, 'imageUrl') ?: null,
                ];
            }
        } else {
            // Backward-compatibility with old syntax that only passed an array of strings
            // We are no longer using this syntax in the extension itself
            foreach ((array) Arr::get($attributes, 'relationships.options') as $answerText) {
                $optionsData[] = [
                    'answer' => (string) $answerText,
                ];
            }
        }

        $this->validator->assertValid($attributes);

        foreach ($optionsData as $optionData) {
            // It is guaranteed all keys exist in the array because $optionData is manually created above
            // This ensures every attribute will be validated (Flarum doesn't validate missing keys)
            $this->optionValidator->assertValid($optionData);
        }

        $event->discussion->afterSave(function ($discussion) use ($optionsData, $attributes, $event) {
            $endDate = Arr::get($attributes, 'endDate');

            $poll = Poll::build(
                Arr::get($attributes, 'question'),
                $discussion->id,
                $event->actor->id,
                $endDate !== null ? Carbon::createFromTimeString($endDate) : null,
                Arr::get($attributes, 'publicPoll')
            );

            $this->events->dispatch(new SavingPollAttributes($event->actor, $poll, $attributes, $event->data));

            $poll->save();

            $this->events->dispatch(new PollWasCreated($event->actor, $poll));

            foreach ($optionsData as $optionData) {
                $option = PollOption::build(Arr::get($optionData, 'answer'), Arr::get($optionData, 'imageUrl'));

                $poll->options()->save($option);
            }
        });
    }
}
