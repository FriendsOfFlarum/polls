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
use FoF\Polls\PollRepository;
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class EditPollHandler
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

    /**
     * @var PollRepository
     */
    protected $polls;

    public function __construct(PollRepository $polls, PollValidator $validator, PollOptionValidator $optionValidator, Dispatcher $events, SettingsRepositoryInterface $settings)
    {
        $this->validator = $validator;
        $this->optionValidator = $optionValidator;
        $this->events = $events;
        $this->settings = $settings;
        $this->polls = $polls;
    }

    public function handle(EditPoll $command)
    {
        $poll = $this->polls->findOrFail($command->pollId, $command->actor);

        $command->actor->assertCan('edit', $poll);

        $attributes = (array) Arr::get($command->data, 'attributes');
        $options = collect(Arr::get($attributes, 'options', []));

        $this->validator->assertValid($attributes);

        if (isset($attributes['question'])) {
            $poll->question = $attributes['question'];
        }

        foreach (['publicPoll', 'allowMultipleVotes', 'hideVotes'] as $key) {
            if (isset($attributes[$key])) {
                $poll->settings[Str::snake($key)] = (bool) $attributes[$key];
            }
        }

        if (isset($attributes['maxVotes'])) {
            $maxVotes = (int) $attributes['maxVotes'];
            $poll->settings['max_votes'] = min(max($maxVotes, 0), $options->count());
        }

        if (isset($attributes['endDate'])) {
            $endDate = $attributes['endDate'];

            if (is_string($endDate)) {
                $date = Carbon::parse($endDate);

                if (!$poll->hasEnded() && $date->isFuture() && ($poll->end_date === null || $poll->end_date->lessThanOrEqualTo($date))) {
                    $poll->end_date = $date->utc();
                }
            } elseif (is_bool($endDate) && !$endDate) {
                $poll->end_date = null;
            }
        }

        $this->events->dispatch(new SavingPollAttributes($command->actor, $poll, $attributes, $command->data));

        $poll->save();

        // remove options not passed if 2 or more are
        if ($options->isNotEmpty() && $options->count() >= 2) {
            $ids = $options->pluck('id')->whereNotNull()->toArray();

            $poll->options()->whereNotIn('id', $ids)->delete();
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
