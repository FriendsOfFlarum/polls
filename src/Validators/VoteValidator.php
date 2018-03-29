<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls\Validators;

use Flarum\Core\Validator\AbstractValidator;

class VoteValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'poll_id' => 'required',
        ];
    }
}
