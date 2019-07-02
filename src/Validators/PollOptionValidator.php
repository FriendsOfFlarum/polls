<?php


namespace FoF\Polls\Validators;

use Flarum\Foundation\AbstractValidator;

class PollOptionValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'answer' => 'required',
        ];
    }
}