# Polls by FriendsOfFlarum

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/polls.svg)](https://packagist.org/packages/fof/polls) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate)

A [Flarum](https://flarum.org) extension that adds polls to your discussions.

## Installation

```sh
composer require fof/polls:"*"
```

## Updating

```sh
composer update fof/polls
php flarum migrate
php flarum cache:clear
```

## Features

- Create polls in discussions or as standalone global polls
- Single and multiple choice voting
- Public/private vote visibility
- Poll end dates
- Poll images with WebP conversion and HiDPI (srcset) support
- Poll option images
- Poll groups for organizing global polls
- Granular permissions for poll creation, voting, and moderation

## Image Handling

### WebP Conversion & srcset

Uploaded images are automatically converted to WebP format (or preserved as GIF for animated images) and stored with responsive variants:

- **Base (1x)** - sized to admin-configured dimensions (default 250x250)
- **@2x** - double resolution for HiDPI displays
- **@3x** - triple resolution for ultra-high DPI displays

Variants are only generated when the source image is large enough — images are never upscaled.

The API response includes an `imageSrcset` field that browsers use to select the appropriate resolution automatically.

### Converting Existing Images

If you're upgrading from a previous version, existing PNG images can be converted to the new WebP format with srcset variants:

```sh
php flarum fof:polls:convert-images
```

This is optional — existing PNG images will continue to work without conversion. Add `--cleanup` to remove original PNG files after successful conversion:

```sh
php flarum fof:polls:convert-images --cleanup
```

### Image Settings

Configure in the admin panel under the Polls extension settings:

| Setting | Default | Description |
|---------|---------|-------------|
| Allow image uploads | Off | Enable the image upload feature |
| Allow option images | Off | Enable images on individual poll options |
| Image width | 250 | Base width in pixels (2x and 3x derived automatically) |
| Image height | 250 | Base height in pixels |

### Metadata Refresh

To improve performance, Polls calculates and stores the number of votes when it changes.

If you made manual changes to the database you can refresh the numbers:

```sh
php flarum fof:polls:refresh
```

## Deprecations

### External Image URLs (Deprecated in 2.0)

**Will be removed in the next major version.**

Previous versions allowed pasting external image URLs directly. This is now deprecated in favour of the built-in upload system which provides:

- Proper image validation and security checks
- Automatic WebP conversion for better performance
- srcset variants for HiDPI displays
- Consistent storage and CDN support

**What this means:**

- Existing polls with external URL images will continue to display normally
- The URL paste input has been removed from the poll creation form
- When editing an existing poll with a URL image, a deprecation notice is shown encouraging re-upload
- Extensions that relied on `isImageUpload` should transition to checking `imageSrcset` presence instead

### For Extension Developers

If your extension integrates with fof/polls images:

- **`isImageUpload` field** — Deprecated on both `PollResource` and `PollOptionResource`. Use the presence of `imageSrcset` to determine if an image has responsive variants.
- **`PollImageWillBeResized` event** — Constructor signature updated to include `isAnimated` parameter. Update any listeners.
- **`PollImageUploader` service** — New service class for image operations. Use this instead of direct filesystem access for uploading, deleting, or generating srcset strings.
- **Frontend `<img>` tags** — Use the `imageSrcset()` model accessor and pass it as the `srcset` attribute.

## Poll Groups

Poll Groups allow you to organize multiple polls under a single topic. Enable via the admin setting "Enable poll groups".

**Permissions:**
- *View poll groups* — Controls who can see poll groups
- *Create poll groups* — Controls who can create new poll groups
- *Moderate poll groups* — Allows moderators to edit and delete any poll groups

## Links

- [Discuss](https://discuss.flarum.org/d/20586)
- [GitHub](https://github.com/FriendsOfFlarum/polls)
- [Packagist](https://packagist.org/packages/fof/polls)
- [Open Collective](https://opencollective.com/fof/donate)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
