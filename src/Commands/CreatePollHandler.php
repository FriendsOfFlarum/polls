<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Commands;

use Carbon\Carbon;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Polls\Events\PollWasCreated;
use FoF\Polls\Events\SavingPollAttributes;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class CreatePollHandler
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
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(PollValidator $validator, PollOptionValidator $optionValidator, Dispatcher $events, SettingsRepositoryInterface $settings)
    {
        $this->validator = $validator;
        $this->optionValidator = $optionValidator;
        $this->events = $events;
        $this->settings = $settings;
    }


    public function handle(CreatePoll $command)
    {
        $command->actor->assertCan('startPoll', $command->post);

        $attributes = $command->data;

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
        }

        $this->validator->assertValid($attributes);

        foreach ($optionsData as $optionData) {
            // It is guaranteed all keys exist in the array because $optionData is manually created above
            // This ensures every attribute will be validated (Flarum doesn't validate missing keys)
            $this->optionValidator->assertValid($optionData);
        }

        return ($command->savePollOn)(function () use ($optionsData, $attributes, $command) {
            $endDate = Arr::get($attributes, 'endDate');
            $carbonDate = Carbon::parse($endDate);

            if (!$carbonDate->isFuture()) {
                $carbonDate = null;
            }

            $poll = Poll::build(
                Arr::get($attributes, 'question'),
                $command->post->id,
                $command->actor->id,
                $carbonDate != null ? $carbonDate->utc() : null,
                Arr::get($attributes, 'publicPoll'),
                Arr::get($attributes, 'allowMultipleVotes'),
                Arr::get($attributes, 'maxVotes')
            );

            $this->events->dispatch(new SavingPollAttributes($command->actor, $poll, $attributes, $attributes));

            $poll->save();

            $this->events->dispatch(new PollWasCreated($command->actor, $poll));

            foreach ($optionsData as $optionData) {
                $imageUrl = Arr::get($optionData, 'imageUrl');

                if (!$this->settings->get('fof-polls.allowOptionImage')) {
                    $imageUrl = null;
                }

                $option = PollOption::build(Arr::get($optionData, 'answer'), $imageUrl);

                $poll->options()->save($option);
            }

            return $poll;
        });
    }
}
