<?php

namespace Treefiction\Polls\Validators;

use Flarum\Core\Validator\AbstractValidator;

class VoteValidator extends AbstractValidator
{
    protected function getRules()
    {
        return array(
            'poll_id' => 'required'
        );
    }
}
