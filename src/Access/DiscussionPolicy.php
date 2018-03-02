<?php

namespace Treefiction\Polls\Access;

use Flarum\Core\Access\AbstractPolicy;
use Flarum\Core\Discussion;

class DiscussionPolicy extends AbstractPolicy
{
    protected $model = Discussion::class;
}
