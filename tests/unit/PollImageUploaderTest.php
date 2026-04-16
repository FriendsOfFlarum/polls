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

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Polls\PollImageUploader;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class PollImageUploaderTest extends TestCase
{
    protected function makeUploader(int $baseWidth = 250, int $baseHeight = 250, ?Cloud $disk = null): PollImageUploader
    {
        $settings = $this->createMock(SettingsRepositoryInterface::class);
        $settings->method('get')->willReturnCallback(function ($key) use ($baseWidth, $baseHeight) {
            return match ($key) {
                'fof-polls.image_width' => $baseWidth,
                'fof-polls.image_height' => $baseHeight,
                default => null,
            };
        });

        $factory = $this->createMock(Factory::class);
        $factory->method('disk')->willReturn($disk ?? $this->createMock(Cloud::class));

        return new PollImageUploader($factory, $settings);
    }

    #[Test]
    public function variant_path_returns_base_for_empty_suffix(): void
    {
        $uploader = $this->makeUploader();

        $this->assertEquals('pollImage-abc.webp', $uploader->variantPath('pollImage-abc.webp', ''));
    }

    #[Test]
    public function variant_path_inserts_suffix_before_extension(): void
    {
        $uploader = $this->makeUploader();

        $this->assertEquals('pollImage-abc@2x.webp', $uploader->variantPath('pollImage-abc.webp', '@2x'));
        $this->assertEquals('pollImage-abc@3x.webp', $uploader->variantPath('pollImage-abc.webp', '@3x'));
    }

    #[Test]
    public function variant_path_handles_gif_extension(): void
    {
        $uploader = $this->makeUploader();

        $this->assertEquals('pollImage-abc@2x.gif', $uploader->variantPath('pollImage-abc.gif', '@2x'));
    }

    #[Test]
    public function variant_path_handles_no_extension(): void
    {
        $uploader = $this->makeUploader();

        $this->assertEquals('pollImage-abc@2x', $uploader->variantPath('pollImage-abc', '@2x'));
    }

    #[Test]
    public function variant_paths_returns_all_three(): void
    {
        $uploader = $this->makeUploader();

        $paths = $uploader->variantPaths('pollImage-abc.webp');

        $this->assertCount(3, $paths);
        $this->assertEquals('pollImage-abc.webp', $paths[0]);
        $this->assertEquals('pollImage-abc@2x.webp', $paths[1]);
        $this->assertEquals('pollImage-abc@3x.webp', $paths[2]);
    }

    #[Test]
    public function get_sizes_uses_settings(): void
    {
        $uploader = $this->makeUploader(300, 200);

        $sizes = $uploader->getSizes();

        $this->assertEquals([300, 200], $sizes['']);
        $this->assertEquals([600, 400], $sizes['@2x']);
        $this->assertEquals([900, 600], $sizes['@3x']);
    }

    #[Test]
    public function get_sizes_defaults_to_250(): void
    {
        $uploader = $this->makeUploader(0, 0);

        $sizes = $uploader->getSizes();

        $this->assertEquals([250, 250], $sizes['']);
    }

    #[Test]
    public function srcset_for_returns_null_for_external_url(): void
    {
        $uploader = $this->makeUploader();

        $this->assertNull($uploader->srcsetFor('https://example.com/image.jpg'));
    }

    #[Test]
    public function srcset_for_returns_null_when_only_base_exists(): void
    {
        $disk = $this->createMock(Cloud::class);
        $disk->method('exists')->willReturnCallback(function ($path) {
            return $path === 'pollImage-abc.webp'; // only base exists
        });

        $uploader = $this->makeUploader(250, 250, $disk);

        $this->assertNull($uploader->srcsetFor('pollImage-abc.webp'));
    }

    #[Test]
    public function srcset_for_returns_string_when_variants_exist(): void
    {
        $disk = $this->createMock(Cloud::class);
        $disk->method('exists')->willReturn(true); // all variants exist
        $disk->method('url')->willReturnCallback(function ($path) {
            return 'https://example.com/assets/polls/' . $path;
        });

        $uploader = $this->makeUploader(250, 250, $disk);

        $srcset = $uploader->srcsetFor('pollImage-abc.webp');

        $this->assertNotNull($srcset);
        $this->assertStringContainsString('1x', $srcset);
        $this->assertStringContainsString('2x', $srcset);
        $this->assertStringContainsString('3x', $srcset);
        $this->assertStringContainsString('pollImage-abc.webp', $srcset);
        $this->assertStringContainsString('pollImage-abc@2x.webp', $srcset);
        $this->assertStringContainsString('pollImage-abc@3x.webp', $srcset);
    }

    #[Test]
    public function srcset_for_returns_partial_when_some_variants_exist(): void
    {
        $disk = $this->createMock(Cloud::class);
        $disk->method('exists')->willReturnCallback(function ($path) {
            return in_array($path, ['pollImage-abc.webp', 'pollImage-abc@2x.webp']);
        });
        $disk->method('url')->willReturnCallback(function ($path) {
            return 'https://example.com/assets/polls/' . $path;
        });

        $uploader = $this->makeUploader(250, 250, $disk);

        $srcset = $uploader->srcsetFor('pollImage-abc.webp');

        $this->assertNotNull($srcset);
        $this->assertStringContainsString('1x', $srcset);
        $this->assertStringContainsString('2x', $srcset);
        $this->assertStringNotContainsString('3x', $srcset);
    }

    #[Test]
    public function delete_all_variants_removes_existing_files(): void
    {
        $disk = $this->createMock(Cloud::class);
        $disk->method('exists')->willReturn(true);
        $disk->expects($this->exactly(3))->method('delete');

        $uploader = $this->makeUploader(250, 250, $disk);

        $uploader->deleteAllVariants('pollImage-abc.webp');
    }

    #[Test]
    public function delete_all_variants_skips_non_existing(): void
    {
        $disk = $this->createMock(Cloud::class);
        $disk->method('exists')->willReturn(false);
        $disk->expects($this->never())->method('delete');

        $uploader = $this->makeUploader(250, 250, $disk);

        $uploader->deleteAllVariants('pollImage-abc.webp');
    }

    #[Test]
    public function url_returns_disk_url(): void
    {
        $disk = $this->createMock(Cloud::class);
        $disk->method('url')->willReturn('https://example.com/assets/polls/pollImage-abc.webp');

        $uploader = $this->makeUploader(250, 250, $disk);

        $this->assertEquals(
            'https://example.com/assets/polls/pollImage-abc.webp',
            $uploader->url('pollImage-abc.webp')
        );
    }

}
