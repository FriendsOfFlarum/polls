<?php

namespace FoF\Polls\Listeners;

use Flarum\Settings\Event\Saved;

class ClearFormatterCache
{
    public function handle(Saved $event): void
    {
        foreach ($event->settings as $key => $value) {
            if ($key === 'fof-polls.optionsColorBlend') {
                resolve('fof-user-bio.formatter')->flush();

                return;
            }
        }
    }
}
