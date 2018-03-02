<?php

namespace Treefiction\Polls\Access;

use Flarum\Core\Access\AbstractPolicy;
use Flarum\Core\Discussion;
use Flarum\Core\User;

class DiscussionPolicy extends AbstractPolicy
{
    protected $model = Discussion::class;

}
