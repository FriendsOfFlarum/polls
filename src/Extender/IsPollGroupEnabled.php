<?php

namespace FoF\Polls\Extender;

use Flarum\Settings\SettingsRepositoryInterface;

class IsPollGroupEnabled
{
    public function __invoke(SettingsRepositoryInterface  $settings)
    {
        return (bool)$settings->get('fof-polls.enablePollGroups', false);
    }
}