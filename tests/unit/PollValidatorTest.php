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

class PollValidatorTest extends TestCase
{
    private function makeValidator(): PollValidator
    {
        $factory = new Factory(new IlluminateTranslator(new ArrayLoader(), 'en'));

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
        $this->assertTrue(true);
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
        $v = $this->makeValidator();
        $this->expectException(ValidationException::class);
        $v->assertValid([
            'question' => 'Q',
            'image'    => str_repeat('a', 256),
        ]);
    }

    #[Test]
    public function partialInputSkipsRulesForAbsentFields(): void
    {
        $v = $this->makeValidator();
        $v->assertValid(['question' => 'Q']);
        $this->assertTrue(true);
    }

    #[Test]
    public function questionOnlyInputIsAccepted(): void
    {
        $v = $this->makeValidator();
        $v->assertValid(['question' => 'Just a question']);
        $this->assertTrue(true);
    }
}
