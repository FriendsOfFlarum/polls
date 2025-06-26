<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class AddForumAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(ForumSerializer $serializer, array $model, array $attributes): array
    {
        $attributes['canStartPolls'] = $serializer->getActor()->can('discussion.polls.start');
        $attributes['canStartGlobalPolls'] = $serializer->getActor()->can('startGlobalPoll');

        $areUploadsEnabled = (bool) $this->settings->get('fof-polls.allowImageUploads');
        $attributes['canUploadPollImages'] = $areUploadsEnabled && $serializer->getActor()->can('uploadPollImages');

        if ($this->settings->get('fof-polls.enablePollGroups', false)) {
            $attributes['canStartPollGroup'] = $serializer->getActor()->can('startPollGroup');
            $attributes['canViewPollGroups'] = $serializer->getActor()->can('viewPollGroups');
        } else {
            $attributes['canStartPollGroup'] = false;
            $attributes['canViewPollGroups'] = false;
        }

        return $attributes;
    }
}
