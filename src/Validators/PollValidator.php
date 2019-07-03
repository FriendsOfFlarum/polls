<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Validators;

use Flarum\Foundation\AbstractValidator;

class PollValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'question'   => 'required',
            'publicPoll' => 'nullable|boolean',
            'endDate'    => 'nullable|date|after:today',
        ];
    }
}
