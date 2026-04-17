<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Support\Fluent;
use Illuminate\Validation\Rule;

class PollValidator extends AbstractValidator
{
    protected bool $draft = false;

    public function setDraft(bool $draft): void
    {
        $this->draft = $draft;
    }

    protected function getAttributeNames()
    {
        return [];
    }

    protected function getRules()
    {
        if ($this->draft) {
            return [
                'question' => 'required',
            ];
        }

        return [
            'question'   => 'required',
            'publicPoll' => 'nullable|boolean',
            'image'      => 'nullable|url',
            'endDate'    => [
                'nullable',
                // max of 'timestamp' SQL column is 2038-01-18
                Rule::when(function (Fluent $input) {
                    return !is_bool($input->get('endDate'));
                }, 'date|after:now|before:2038-01-18'),
            ],
        ];
    }
}
