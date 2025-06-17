<?php

namespace FoF\Polls\Validators;

use Flarum\Foundation\AbstractValidator;

class PollGroupValidator extends AbstractValidator
{
    protected $rules = [
        'name' => 'required|string|max:255',
    ];
}