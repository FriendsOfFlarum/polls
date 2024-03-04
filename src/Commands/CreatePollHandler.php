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
use Flarum\Post\PostRepository;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Polls\Events\PollWasCreated;
use FoF\Polls\Events\SavingPollAttributes;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Psr\Http\Message\UploadedFileInterface;

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

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @var Cloud
     */
    protected $pollsUploadDir;

    /**
     * @var ImageManager
     */
    protected $imageManager;

    public function __construct(PostRepository $posts, PollValidator $validator, PollOptionValidator $optionValidator, Dispatcher $events, SettingsRepositoryInterface $settings, Factory $filesystemFactory, ImageManager $imageManager)
    {
        $this->validator = $validator;
        $this->optionValidator = $optionValidator;
        $this->events = $events;
        $this->settings = $settings;
        $this->posts = $posts;
        $this->pollsUploadDir = $filesystemFactory->disk('fof-polls');
        $this->imageManager = $imageManager;
    }

    public function handle(CreatePoll $command)
    {
        if ($command->post) {
            $command->actor->assertCan('startPoll', $command->post);
        } else {
            $command->actor->assertCan('startGlobalPoll');
        }

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
                    'imageUrl' => Arr::get($rawOptionData, 'imageUrl'),
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

            $imageStream = Arr::get($attributes, 'pollImage');

            $poll = Poll::build(
                Arr::get($attributes, 'question'),
                $command->post ? $command->post->id : null,
                $command->actor->id,
                $carbonDate != null ? $carbonDate->utc() : null,
                Arr::get($attributes, 'publicPoll'),
                Arr::get($attributes, 'allowMultipleVotes'),
                Arr::get($attributes, 'maxVotes'),
                Arr::get($attributes, 'hideVotes'),
                Arr::get($attributes, 'allowChangeVote'),
                Arr::get($attributes, 'subtitle')
            );

            if ($imageStream) {
                $this->storeImage($imageStream, $poll);
            }

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

    protected function storeImage(UploadedFileInterface $file, Poll &$poll): ?string
    {
        $fileExtension = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);

        $encodedImage = $this->imageManager->make($file->getStream()->getMetaData('uri'))->encode('png');

        $uploadName = 'poll_'.$poll->id.'-'.Str::lower(Str::random(8)).$fileExtension;

        $this->pollsUploadDir->put($uploadName, $encodedImage);

        $poll->image_url = $uploadName;
        if ($poll->isDirty('image_url')) {
            $poll->save();
        }

        return $uploadName;
    }
}
