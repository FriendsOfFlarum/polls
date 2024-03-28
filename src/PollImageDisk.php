<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls;

use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;

class PollImageDisk
{
    public function __invoke(Paths $paths, UrlGenerator $url): array
    {
        return [
            'root'   => "$paths->public/assets/polls",
            'url'    => $url->to('forum')->path('assets/polls'),
        ];
    }
}
