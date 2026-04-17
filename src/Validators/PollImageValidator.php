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
use Flarum\Foundation\ValidationException;
use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Validation\Factory;
use Intervention\Gif\Exceptions\DecoderException as GifDecoderException;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\ImageManager;
use Psr\Http\Message\UploadedFileInterface;
use Symfony\Component\Mime\MimeTypes;

class PollImageValidator extends AbstractValidator
{
    public function __construct(
        Factory $validator,
        TranslatorInterface $translator,
        protected ImageManager $imageManager,
        protected SettingsRepositoryInterface $settings,
    ) {
        parent::__construct($validator, $translator);
    }

    public function assertValid(array $attributes): void
    {
        $this->laravelValidator = $this->makeValidator($attributes);

        $file = $attributes['pollImage'] ?? $attributes['pollOptionImage'] ?? null;

        if ($file === null) {
            $this->raise('required');
        }

        $this->assertFileRequired($file);
        $this->assertFileMimes($file);
        $this->assertFileSize($file);
    }

    protected function assertFileRequired(UploadedFileInterface $file): void
    {
        $error = $file->getError();

        if ($error !== UPLOAD_ERR_OK) {
            if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
                $this->raise('file_too_large');
            }

            if ($error === UPLOAD_ERR_NO_FILE) {
                $this->raise('required');
            }

            $this->raise('file_upload_failed');
        }
    }

    protected function assertFileMimes(UploadedFileInterface $file): void
    {
        $allowedTypes = $this->getAllowedTypes();

        // Block PHP files masquerading as images
        $phpExtensions = ['php', 'php3', 'php4', 'php5', 'phtml'];
        $fileExtension = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);

        if (in_array(strtolower(trim($fileExtension)), $phpExtensions)) {
            $this->raise('mimes', [':values' => implode(', ', $allowedTypes)]);
        }

        $guessedExtension = MimeTypes::getDefault()->getExtensions($file->getClientMediaType())[0] ?? null;

        if (!in_array($guessedExtension, $allowedTypes)) {
            $this->raise('mimes', [':values' => implode(', ', $allowedTypes)]);
        }

        try {
            $this->imageManager->read($file->getStream()->getMetadata('uri'));
        } catch (DecoderException|GifDecoderException) {
            $this->raise('image');
        }
    }

    protected function assertFileSize(UploadedFileInterface $file): void
    {
        $maxSize = $this->getMaxSize();

        if ($file->getSize() / 1024 > $maxSize) {
            $this->raise('max.file', [':max' => $maxSize], 'max');
        }
    }

    protected function raise(string $error, array $parameters = [], ?string $rule = null): void
    {
        $message = $this->laravelValidator->makeReplacements(
            $this->translator->trans("validation.$error"),
            'pollImage',
            $rule ?? $error,
            array_values($parameters)
        );

        throw new ValidationException(['pollImage' => $message]);
    }

    public function getMaxSize(): int
    {
        return (int) $this->settings->get('fof-polls.maxImageUploadSize');
    }

    protected function getAllowedTypes(): array
    {
        return ['jpeg', 'jpg', 'png', 'bmp', 'gif', 'webp'];
    }
}
