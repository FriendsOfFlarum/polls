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
use FoF\Polls\Events\SavingPollAttributes;
use FoF\Polls\Poll;
use FoF\Polls\Validators\PollOptionValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class EditPollHandler
{
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

    public function __construct(PollOptionValidator $optionValidator, Dispatcher $events, SettingsRepositoryInterface $settings)
    {
        $this->optionValidator = $optionValidator;
        $this->events = $events;
        $this->settings = $settings;
    }

    public function handle(EditPoll $command)
    {
        /**
         * @var $poll Poll
         */
        $poll = Poll::findOrFail($command->pollId);

        $command->actor->assertCan('edit', $poll);

        $attributes = (array) Arr::get($command->data, 'attributes');
        $options = collect(Arr::get($attributes, 'options', []));

        if (isset($attributes['question'])) {
            $poll->question = $attributes['question'];
        }

        if (isset($attributes['publicPoll'])) {
            $poll->public_poll = (bool) $attributes['publicPoll'];
        }

        if (isset($attributes['allowMultipleVotes'])) {
            $poll->allow_multiple_votes = (bool) $attributes['allowMultipleVotes'];
        }

        if (isset($attributes['maxVotes'])) {
            $maxVotes = (int) $attributes['maxVotes'];
            $poll->max_votes = min(max($maxVotes, 0), $options->count());
        }

        if (isset($attributes['endDate'])) {
            $endDate = $attributes['endDate'];

            if (is_string($endDate)) {
                $date = Carbon::createFromTimeString($attributes['endDate']);

                if (!$poll->hasEnded() && $date->isFuture() && ($poll->end_date === null || $poll->end_date->lessThanOrEqualTo($date))) {
                    $poll->end_date = $date;
                }
            } elseif (is_bool($endDate) && !$endDate) {
                $poll->end_date = null;
            }
        }

        $this->events->dispatch(new SavingPollAttributes($command->actor, $poll, $attributes, $command->data));

        $poll->save();

        // remove options not passed if 2 or more are
        if ($options->isNotEmpty() && $options->count() >= 2) {
            $ids = $options->pluck('id');

            $poll->options()->each(function ($option) use ($ids) {
                /*
                 * @var PollOption
                 */
                if (!$ids->contains($option->id)) {
                    $option->delete();
                }
            });
        }

        // update + add new options
        foreach ($options as $key => $opt) {
            $id = Arr::get($opt, 'id');

            $optionAttributes = [
                'answer'   => Arr::get($opt, 'attributes.answer'),
                'imageUrl' => Arr::get($opt, 'attributes.imageUrl') ?: null,
            ];

            if (!$this->settings->get('fof-polls.allowOptionImage')) {
                unset($optionAttributes['imageUrl']);
            }

            $this->optionValidator->assertValid($optionAttributes);

            $poll->options()->updateOrCreate([
                'id' => $id,
            ], [
                'answer'    => Arr::get($optionAttributes, 'answer'),
                'image_url' => Arr::get($optionAttributes, 'imageUrl'),
            ]);
        }

        return $poll;
    }
}
