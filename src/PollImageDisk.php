<?php

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
