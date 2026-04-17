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
use FoF\Polls\Events\PollOptionUpdated;
use FoF\Polls\Events\SavingPollAttributes;
use FoF\Polls\Poll;
use FoF\Polls\PollImageUploader;
use FoF\Polls\PollOption;
use FoF\Polls\PollRepository;
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class EditPollHandler
{
    use PollGroupRelationTrait;

    public function __construct(
        protected PollRepository $polls,
        protected PollValidator $validator,
        protected PollOptionValidator $optionValidator,
        protected Dispatcher $events,
        protected SettingsRepositoryInterface $settings,
        protected PollImageUploader $uploader,
    ) {
    }

    public function handle(EditPoll $command): Poll
    {
        $poll = $this->polls->findOrFail($command->pollId, $command->actor);

        $command->actor->assertCan('edit', $poll);

        $attributes = (array) Arr::get($command->data, 'attributes');
        $options = collect((array) Arr::get($attributes, 'options', []));

        $this->validator->assertValid($attributes);

        if (isset($attributes['question'])) {
            $poll->question = $attributes['question'];
        }

        if (isset($attributes['subtitle'])) {
            $poll->subtitle = empty($attributes['subtitle']) ? null : $attributes['subtitle'];
        }

        if (isset($attributes['pollImage'])) {
            $newImage = empty($attributes['pollImage']) ? null : $attributes['pollImage'];

            // Clean up old image files if the image is changing
            if ($poll->image && $poll->image !== $newImage && !filter_var($poll->image, FILTER_VALIDATE_URL)) {
                $this->uploader->deleteAllVariants($poll->image);
            }

            $poll->image = $newImage;
        }

        if (isset($attributes['imageAlt'])) {
            $poll->image_alt = empty($attributes['imageAlt']) ? null : $attributes['imageAlt'];
        }

        foreach (['publicPoll', 'allowMultipleVotes', 'hideVotes', 'allowChangeVote'] as $key) {
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

                if (!$poll->hasEnded() && $date->isFuture() && ($poll->isGlobal() || $poll->end_date === null || $poll->end_date->lessThanOrEqualTo($date))) {
                    $poll->end_date = $date->utc();
                }
            } elseif (is_bool($endDate) && !$endDate) {
                $poll->end_date = null;
            }
        }

        $this->setPollGroupRelationData($command->actor, $poll, $command->data);

        $this->events->dispatch(new SavingPollAttributes($command->actor, $poll, $attributes, $command->data));

        $poll->save();

        // remove options not passed if 2 or more are
        if ($options->isNotEmpty() && $options->count() >= 2) {
            $ids = $options->pluck('id')->whereNotNull()->toArray();

            // Clean up image files for options being removed
            $removedOptions = $poll->options()->whereNotIn('id', $ids)->get();

            foreach ($removedOptions as $removedOption) {
                /** @var PollOption $removedOption */
                if ($removedOption->image_url && !filter_var($removedOption->image_url, FILTER_VALIDATE_URL)) {
                    $this->uploader->deleteAllVariants($removedOption->image_url);
                }
            }

            $poll->options()->whereNotIn('id', $ids)->delete();
        }

        // update + add new options
        foreach ($options as $key => $opt) {
            $id = Arr::get($opt, 'id');

            $rawImageUrl = Arr::get($opt, 'attributes.imageUrl');

            // The frontend may send a full URL (from the computed imageUrl attribute)
            // instead of just the filename. Normalize to filename only.
            if ($rawImageUrl && filter_var($rawImageUrl, FILTER_VALIDATE_URL)) {
                $rawImageUrl = basename(parse_url($rawImageUrl, PHP_URL_PATH));
            }

            $optionAttributes = [
                'answer'   => Arr::get($opt, 'attributes.answer'),
                'imageUrl' => $rawImageUrl,
            ];

            $this->optionValidator->assertValid($optionAttributes);

            // Clean up old image if option exists and image is changing
            if ($id) {
                /** @var PollOption|null $existingOption */
                $existingOption = $poll->options()->find($id);

                if ($existingOption && $existingOption->image_url) {
                    $newImageUrl = Arr::get($optionAttributes, 'imageUrl');

                    if ($existingOption->image_url !== $newImageUrl && !filter_var($existingOption->image_url, FILTER_VALIDATE_URL)) {
                        $this->uploader->deleteAllVariants($existingOption->image_url);
                    }
                }
            }

            /** @var PollOption $option */
            $option = $poll->options()->updateOrCreate([
                'id' => $id,
            ], [
                'answer'    => Arr::get($optionAttributes, 'answer'),
                'image_url' => Arr::get($optionAttributes, 'imageUrl'),
            ]);

            $this->events->dispatch(new PollOptionUpdated($option, $command->actor));
        }

        return $poll;
    }
}
