<?php

namespace Flagrow\Mason\Validaors;
namespace Treefiction\Polls\Validators;

use Flarum\Core\Validator\AbstractValidator;

class VoteValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'poll_id' => 'required'
        ];
    }
}
