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

## Global Polls

### What Are Global Polls?

Global polls are polls that exist on their own, independent of any discussion. Instead of being attached to a post, they appear on a dedicated **Polls** page accessible from the main navigation, where members can browse and vote on them as standalone items.

### What Can You Use Global Polls For?

- **Community-wide votes:** feature requests, governance decisions, or general-interest questions that shouldn't be buried inside a thread.
- **Announcements & surveys:** recurring satisfaction surveys, event planning, or quick "pulse" polls.
- **Long-running questions:** polls with end dates that stay discoverable on the page until they close.

### Enabling Global Polls

1. In the admin panel, open the **Polls** extension settings and enable **Allow global polls**.
2. Grant the **Start a global poll** permission (`startGlobalPoll`) to the groups you want to be able to create global polls.
3. A **Polls** link appears in the forum navigation, pointing at the page of published global polls.

### How to Use

1. **Create a global poll:**
   Navigate to the Polls page and click **New poll**. Fill in the question, options, and any optional settings (end date, image, multiple votes, etc.), then publish.

2. **Browse & filter:**
   The page supports sorting (newest, most voted, ending soon) and a status filter (All / Published / Drafts). Drafts are only visible to their author, moderators, and administrators.

3. **Vote:**
   Open a poll to cast your vote and see the results.

### Permissions

- *Start a global poll (`startGlobalPoll`)*: who can create global polls. In practice this is usually limited to administrators and moderators.
- *Moderate polls (`discussion.polls.moderate`)*: moderators can edit, delete, publish, and unpublish any global poll.

### Drafts & Scheduled Publication

Global polls can be saved as drafts, published manually, or scheduled to go live at a specific time. This lets you prepare a poll in advance and have it appear on the Polls page automatically when the scheduled moment arrives.

#### How to Use

1. **Create a draft:**
   On the global poll compose page, click **Save as draft**. The poll is stored with `published_at = NULL` and does not appear on the public Polls page.

2. **Publish manually:**
   From either the compose page or the poll controls menu, click **Publish** to mark the draft as published immediately.

3. **Schedule publication:**
   Click the clock icon next to the **Publish** button (or **Schedule publication** in the controls menu) and pick a datetime. The poll stays in draft state until a cron-driven command publishes it.

4. **Cancel a schedule:**
   Use **Cancel schedule** in the controls menu to clear the scheduled time and keep the poll as a draft.

#### Cron setup (required for scheduled publication)

Scheduled drafts are published by Flarum's built-in task scheduler. If you don't already run it, open your crontab:

```sh
crontab -e
```

And add:

```cron
* * * * * cd /path/to/flarum && php flarum schedule:run
```

A single `schedule:run` entry covers scheduled polls and any other extension that registers scheduled tasks — you don't need a polls-specific line. Our task runs every minute and takes row-level locks, so multiple workers (e.g. an ECS deployment with `N > 1` tasks) won't double-publish the same poll.

If a scheduled draft fails validation at publish time (missing question, fewer than two options, etc.), the error is recorded on the poll and future runs skip it until the author fixes the issue and re-schedules.

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
