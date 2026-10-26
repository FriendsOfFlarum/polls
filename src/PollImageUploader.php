<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Str;
use Intervention\Image\Interfaces\ImageInterface;

class PollImageUploader
{
    protected Cloud $uploadDir;

    /** Srcset suffixes — empty string is the base (1×). */
    protected const SUFFIXES = ['', '@2x', '@3x'];

    public function __construct(
        Factory $filesystemFactory,
        protected SettingsRepositoryInterface $settings,
        protected Cache $cache,
    ) {
        $this->uploadDir = $filesystemFactory->disk('fof-polls');
    }

    /**
     * Upload an image, generating WebP (or GIF for animated) variants at 1×, 2×, and 3× sizes.
     * Variants that would require upscaling are skipped.
     *
     * @return string The base filename (e.g. "pollImage-aBcDeFgH.webp")
     */
    public function upload(string $filenamePrefix, ImageInterface $image): string
    {
        $isAnimated = $image->isAnimated();
        $extension = $isAnimated ? 'gif' : 'webp';
        $baseName = $filenamePrefix.'-'.Str::lower(Str::random(8)).'.'.$extension;

        $sourceWidth = $image->width();
        $sourceHeight = $image->height();

        $multipliers = [];

        foreach ($this->getSizes() as $suffix => [$targetWidth, $targetHeight]) {
            // Always generate the base variant. For HiDPI variants, skip if
            // the source is too small (never upscale).
            if ($suffix !== '' && ($sourceWidth < $targetWidth || $sourceHeight < $targetHeight)) {
                continue;
            }

            $resized = clone $image;
            $resized->scaleDown($targetWidth, $targetHeight);

            $encoded = $isAnimated ? $resized->toGif() : $resized->toWebp();

            $this->uploadDir->put($this->variantPath($baseName, $suffix), (string) $encoded);
            $multipliers[$suffix] = $this->multiplierFor($suffix);
        }

        // The upload knows exactly which variants exist, so srcsetFor() never has to ask the disk
        $this->cache->forever($this->variantsCacheKey($baseName), $multipliers);

        return $baseName;
    }

    /**
     * Delete the base file and all HiDPI variants for a given base path.
     * Safe to call with external URLs — the exists() check guards against it.
     */
    public function deleteAllVariants(string $basePath): void
    {
        foreach ($this->variantPaths($basePath) as $path) {
            if ($this->uploadDir->exists($path)) {
                $this->uploadDir->delete($path);
            }
        }

        $this->cache->forget($this->variantsCacheKey($basePath));
    }

    /**
     * Return the srcset string for a given base path, including only variants that exist.
     * Returns null if only the base file exists (no HiDPI variants) or for external URLs.
     */
    public function srcsetFor(string $basePath): ?string
    {
        // External URLs have no local variants.
        if (str_contains($basePath, '://')) {
            return null;
        }

        $multipliers = $this->existingVariants($basePath);

        // Only meaningful if we have more than just the 1× base.
        if (count($multipliers) <= 1) {
            return null;
        }

        $entries = [];
        foreach ($multipliers as $suffix => $multiplier) {
            $url = $this->uploadDir->url($this->variantPath($basePath, $suffix));
            $entries[] = "$url {$multiplier}x";
        }

        return implode(', ', $entries);
    }

    /**
     * Which variants exist for a base path, as suffix => multiplier. Variant names are random
     * per upload and never change afterwards, so the answer is cached indefinitely: `upload()`
     * primes it and `deleteAllVariants()` clears it. The disk is only consulted for images
     * uploaded before this cache existed (once), because on cloud storage every `exists()`
     * is a network round trip and this runs for every image in every poll list response.
     *
     * @return array<string, int>
     */
    protected function existingVariants(string $basePath): array
    {
        return $this->cache->rememberForever($this->variantsCacheKey($basePath), function () use ($basePath) {
            $multipliers = [];

            foreach (array_keys($this->getSizes()) as $suffix) {
                if ($this->uploadDir->exists($this->variantPath($basePath, $suffix))) {
                    $multipliers[$suffix] = $this->multiplierFor($suffix);
                }
            }

            return $multipliers;
        });
    }

    protected function multiplierFor(string $suffix): int
    {
        return $suffix === '' ? 1 : (int) str_replace(['@', 'x'], '', $suffix);
    }

    protected function variantsCacheKey(string $basePath): string
    {
        return 'fof-polls.image_variants.'.$basePath;
    }

    /**
     * Get the public URL for a stored image file.
     */
    public function url(string $basePath): string
    {
        return $this->uploadDir->url($basePath);
    }

    /**
     * Compute the target sizes from admin settings.
     *
     * @return array<string, array{int, int}> Map of suffix => [width, height]
     */
    public function getSizes(): array
    {
        $baseWidth = (int) ($this->settings->get('fof-polls.image_width') ?: 250);
        $baseHeight = (int) ($this->settings->get('fof-polls.image_height') ?: 250);

        return [
            ''    => [$baseWidth, $baseHeight],
            '@2x' => [$baseWidth * 2, $baseHeight * 2],
            '@3x' => [$baseWidth * 3, $baseHeight * 3],
        ];
    }

    /**
     * Derive a variant path from the base path and a suffix.
     * e.g. "pollImage-abc.webp" + "@2x" => "pollImage-abc@2x.webp".
     */
    public function variantPath(string $basePath, string $suffix): string
    {
        if ($suffix === '') {
            return $basePath;
        }

        $dot = strrpos($basePath, '.');

        return $dot !== false
            ? substr($basePath, 0, $dot).$suffix.substr($basePath, $dot)
            : $basePath.$suffix;
    }

    /**
     * Return all variant paths (base + @2x + @3x) for a given base path.
     */
    public function variantPaths(string $basePath): array
    {
        return array_map(
            fn (string $suffix) => $this->variantPath($basePath, $suffix),
            self::SUFFIXES
        );
    }
}
