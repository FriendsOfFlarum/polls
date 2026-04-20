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

use Carbon\Carbon;
use Flarum\Foundation\AbstractValidator;
use Flarum\Foundation\ValidationException;
use Illuminate\Support\Fluent;
use Illuminate\Validation\Rule;

class PollValidator extends AbstractValidator
{
    protected bool $draft = false;

    public function setDraft(bool $draft): void
    {
        $this->draft = $draft;
    }

    /**
     * Parse and normalize a client-supplied `scheduledFor` timestamp.
     *
     * Requires a full ISO 8601 datetime with an explicit timezone — either
     * `Z` or a numeric `±HH:MM` offset. Naive strings (no offset) are
     * rejected so Carbon can't silently fall back to the server's PHP
     * timezone. Fractional seconds are accepted.
     *
     * Returns a normalized UTC Carbon instance for the handler to use
     * directly; throws {@see ValidationException} with the `scheduledFor`
     * pointer on any parse failure.
     */
    public function parseScheduledFor(mixed $value): Carbon
    {
        $error = 'Scheduled time must be an ISO 8601 datetime with a timezone offset (e.g. "2026-05-01T10:00:00Z").';

        if (!is_string($value) || $value === '') {
            throw new ValidationException(['scheduledFor' => $error]);
        }

        // `createFromFormat` with the `P` specifier matches numeric offsets
        // like `+00:00` but not the `Z` shorthand. Rewrite `Z` to `+00:00`
        // so one strict format covers both.
        $normalized = preg_replace('/Z$/', '+00:00', $value);

        // Two strict formats — with and without fractional seconds. The
        // leading `!` resets unparsed fields to the epoch rather than
        // inheriting "now", keeping parsing deterministic.
        foreach (['Y-m-d\TH:i:s.uP', 'Y-m-d\TH:i:sP'] as $format) {
            $dt = \DateTimeImmutable::createFromFormat('!'.$format, $normalized);
            $errors = \DateTimeImmutable::getLastErrors();
            $clean = $errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0);

            if ($dt !== false && $clean) {
                return Carbon::instance($dt)->utc();
            }
        }

        throw new ValidationException(['scheduledFor' => $error]);
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
