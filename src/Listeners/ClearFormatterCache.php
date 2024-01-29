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
