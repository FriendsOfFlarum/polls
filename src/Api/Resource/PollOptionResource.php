<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use FoF\Polls\PollImageUploader;
use FoF\Polls\PollOption;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<PollOption>
 */
class PollOptionResource extends Resource\AbstractDatabaseResource
{
    public function __construct(
        protected PollImageUploader $uploader,
    ) {
    }

    public function type(): string
    {
        return 'poll_options';
    }

    public function model(): string
    {
        return PollOption::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $query->whereHas('poll', function (Builder $query) use ($context) {
            $query->whereVisibleTo($context->getActor());
        });
    }

    public function endpoints(): array
    {
        return [];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('answer'),
            Schema\Str::make('imageUrl')
                ->get(fn (PollOption $option) => $this->getImageUrl($option)),
            Schema\Str::make('imageSrcset')
                ->get(fn (PollOption $option) => $this->getImageSrcset($option)),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),
            Schema\Integer::make('voteCount')
                ->visible(fn (PollOption $option, Context $context) => $context->getActor()->can('seeVoteCount', $option->poll))
                ->get(fn (PollOption $option) => (int) $option->vote_count),
            /**
             * @deprecated Will be removed in the next major version. Use imageSrcset presence instead.
             */
            Schema\Boolean::make('isImageUpload')
                ->visible(fn (PollOption $option) => !empty($this->getImageUrl($option)))
                ->get(fn (PollOption $option) => !filter_var($option->image_url, FILTER_VALIDATE_URL)),
        ];
    }

    public function sorts(): array
    {
        return [];
    }

    protected function getImageUrl(PollOption $option): ?string
    {
        if (!$option->image_url) {
            return null;
        }

        /**
         * @deprecated External URL images are deprecated and will be removed in the next major version.
         */
        if (filter_var($option->image_url, FILTER_VALIDATE_URL)) {
            return $option->image_url;
        }

        return $this->uploader->url($option->image_url);
    }

    protected function getImageSrcset(PollOption $option): ?string
    {
        if (!$option->image_url) {
            return null;
        }

        return $this->uploader->srcsetFor($option->image_url);
    }
}
