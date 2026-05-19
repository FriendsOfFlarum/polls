<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Tests\unit;

use Flarum\Locale\Translator as FlarumTranslator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Translation\ArrayLoader;
use Illuminate\Translation\Translator as IlluminateTranslator;
use Illuminate\Validation\Factory;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * The validator applies one rule set to every save path. Drafts are
 * "publishable but not yet public" — same data requirements as a
 * direct publish — so there is no draft-mode branch to test.
 */
class PollValidatorTest extends TestCase
{
    private function makeValidator(): PollValidator
    {
        // Illuminate Factory needs an Illuminate translator (uses the
        // `Illuminate\Contracts\Translation\Translator` contract).
        $factory = new Factory(new IlluminateTranslator(new ArrayLoader(), 'en'));

        // Flarum's AbstractValidator requires a Flarum\Locale\TranslatorInterface
        // (not Symfony's bare IdentityTranslator). `Flarum\Locale\Translator`
        // extends Symfony's Translator and implements the Flarum contract.
        return new PollValidator($factory, new FlarumTranslator('en'));
    }

    #[Test]
    public function questionIsRequired(): void
    {
        $v = $this->makeValidator();
        $this->expectException(ValidationException::class);
        $v->assertValid(['question' => '']);
    }

    #[Test]
    public function acceptsQuestionWithFutureEndDate(): void
    {
        $v = $this->makeValidator();
        $v->assertValid([
            'question' => 'What is your favourite colour?',
            'endDate'  => '2030-01-01 00:00:00',
        ]);
        $this->assertTrue(true); // no exception = pass
    }

    #[Test]
    public function rejectsPastEndDate(): void
    {
        $v = $this->makeValidator();
        $this->expectException(ValidationException::class);
        $v->assertValid([
            'question' => 'Q',
            'endDate'  => '2000-01-01 00:00:00',
        ]);
    }

    #[Test]
    public function rejectsEndDateBeyond2038TimestampLimit(): void
    {
        $v = $this->makeValidator();
        $this->expectException(ValidationException::class);
        $v->assertValid([
            'question' => 'Q',
            'endDate'  => '3000-01-01 00:00:00',
        ]);
    }

    #[Test]
    public function rejectsImageStringLongerThan255Chars(): void
    {
        // The image rule is `nullable|string|max:255` — it locks in length and
        // type, not URL format. (PR #120's test asserted URL validation, but
        // the rule has never included a `url` constraint.)
        $v = $this->makeValidator();
        $this->expectException(ValidationException::class);
        $v->assertValid([
            'question' => 'Q',
            'image'    => str_repeat('a', 256),
        ]);
    }

    /**
     * Because parent makeValidator() uses Arr::only(getRules(), keys($input)),
     * fields absent from input are not validated. This is intentional partial-
     * update behaviour; this test locks it in so future changes to
     * AbstractValidator's strategy don't silently change polls' contract.
     */
    #[Test]
    public function partialInputSkipsRulesForAbsentFields(): void
    {
        $v = $this->makeValidator();
        // No endDate key at all; rule never applied even though it would
        // reject the value if present.
        $v->assertValid([
            'question' => 'Q',
        ]);
        $this->assertTrue(true);
    }

    #[Test]
    public function questionOnlyInputIsAccepted(): void
    {
        $v = $this->makeValidator();
        // The minimum a draft can be sent with is just `question` —
        // partial updates skip absent rules, so this is the API
        // contract for "save just a question".
        $v->assertValid(['question' => 'Just a question']);
        $this->assertTrue(true);
    }
}
