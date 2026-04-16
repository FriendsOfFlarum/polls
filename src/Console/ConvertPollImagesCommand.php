<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Console;

use FoF\Polls\Poll;
use FoF\Polls\PollImageUploader;
use FoF\Polls\PollOption;
use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Intervention\Image\ImageManager;

class ConvertPollImagesCommand extends Command
{
    protected $signature = 'fof:polls:convert-images
        {--cleanup : Delete original PNG files after successful conversion}';

    protected $description = 'Convert existing PNG poll images to WebP with @2x/@3x srcset variants.';

    protected Cloud $disk;

    public function __construct(
        protected PollImageUploader $uploader,
        protected ImageManager $imageManager,
        Factory $filesystemFactory,
    ) {
        parent::__construct();

        $this->disk = $filesystemFactory->disk('fof-polls');
    }

    public function handle(): int
    {
        $converted = 0;
        $skipped = 0;
        $failed = 0;

        $this->info('Converting poll images...');

        // Convert poll images
        $polls = Poll::whereNotNull('image')->get();

        foreach ($polls as $poll) {
            if ($this->shouldSkip($poll->image)) {
                $skipped++;
                continue;
            }

            try {
                $newName = $this->convertImage($poll->image, 'pollImage');
                $poll->image = $newName;
                $poll->save();
                $converted++;
                $this->line("  Converted poll #{$poll->id}: {$poll->image}");
            } catch (\Throwable $e) {
                $failed++;
                $this->error("  Failed poll #{$poll->id}: {$e->getMessage()}");
            }
        }

        // Convert option images
        $options = PollOption::whereNotNull('image_url')->where('image_url', '!=', '')->get();

        foreach ($options as $option) {
            if ($this->shouldSkip($option->image_url)) {
                $skipped++;
                continue;
            }

            try {
                $newName = $this->convertImage($option->image_url, 'pollOptionImage');
                $option->image_url = $newName;
                $option->save();
                $converted++;
                $this->line("  Converted option #{$option->id}: {$option->image_url}");
            } catch (\Throwable $e) {
                $failed++;
                $this->error("  Failed option #{$option->id}: {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("Done. Converted: {$converted}, Skipped: {$skipped}, Failed: {$failed}");

        if ($converted > 0 && ! $this->option('cleanup')) {
            $this->comment('Original PNG files were kept. Run with --cleanup to remove them.');
        }

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }

    protected function shouldSkip(string $imagePath): bool
    {
        // Skip external URLs
        if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return true;
        }

        // Skip already-converted WebP/GIF files
        $ext = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));

        if (in_array($ext, ['webp', 'gif'])) {
            return true;
        }

        // Skip if file doesn't exist on disk
        if (! $this->disk->exists($imagePath)) {
            return true;
        }

        return false;
    }

    protected function convertImage(string $oldPath, string $prefix): string
    {
        $image = $this->imageManager->read($this->disk->get($oldPath));

        $newName = $this->uploader->upload($prefix, $image);

        if ($this->option('cleanup')) {
            $this->disk->delete($oldPath);
        }

        return $newName;
    }
}
