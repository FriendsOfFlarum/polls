<?php

namespace FoF\Polls\Tests\unit;

use FoF\Polls\Validators\PollValidator;
use Illuminate\Translation\ArrayLoader;
use Illuminate\Translation\Translator;
use Illuminate\Validation\Factory;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Translation\IdentityTranslator;

class PollValidatorDraftTest extends TestCase
{
    private function makeValidator(): PollValidator
    {
        $illuminateTranslator = new Translator(new ArrayLoader(), 'en');
        $factory = new Factory($illuminateTranslator);
        $symfonyTranslator = new IdentityTranslator();

        return new PollValidator($factory, $symfonyTranslator);
    }

    public function test_full_mode_requires_question(): void
    {
        $v = $this->makeValidator();
        $this->expectException(ValidationException::class);
        $v->assertValid(['question' => '']);
    }

    public function test_draft_mode_still_requires_question(): void
    {
        $v = $this->makeValidator();
        $v->setDraft(true);
        $this->expectException(ValidationException::class);
        $v->assertValid(['question' => '']);
    }

    public function test_draft_mode_accepts_question_only(): void
    {
        $v = $this->makeValidator();
        $v->setDraft(true);
        $v->assertValid(['question' => 'What is your favourite colour?']);
        $this->assertTrue(true); // no exception = pass
    }

    public function test_draft_mode_ignores_past_end_date(): void
    {
        $v = $this->makeValidator();
        $v->setDraft(true);
        // full mode would reject "before:now"; draft mode must pass
        $v->assertValid([
            'question' => 'Q',
            'endDate'  => '2000-01-01 00:00:00',
        ]);
        $this->assertTrue(true);
    }
}
