<?php


namespace FoF\Polls\Validators;

use Flarum\Foundation\AbstractValidator;

class PollValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'question' => 'required',
            'publicPoll' => 'nullable|boolean',
            'endDate' => 'nullable|date|after:today'
        ];
    }
}