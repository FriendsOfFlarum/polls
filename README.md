# Polls by FriendsOfFlarum

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/polls.svg)](https://packagist.org/packages/fof/polls) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate) [![Patreon](https://img.shields.io/badge/patreon-datitisev-f96854.svg?logo=patreon)](https://patreon.com/datitisev)

A [Flarum](http://flarum.org) extension. A Flarum extension that adds polls to your discussions.

### Installation

```sh
composer require fof/polls:"*"
```

#### Migrating from ReFlar Polls

Make sure you've updated to the latest `reflar/polls` version and run `php flarum migrate` BEFORE installing `fof/polls`.
You will not be able to install this extension if you have a version of ReFlar Polls older than v1.3.4 as well.

```sh
$ composer require reflar/polls
$ php flarum migrate
$ composer require fof/polls
```

### Updating

```sh
composer update fof/polls
```

### Metadata update

To improve performance, Polls calculates and stores the number of votes when it changes.

As long as the extension is active, Polls will automatically keep those numbers up to date and you don't need to do anything.

If you are updating from a version prior to 0.3.3, if you disabled the extension for a while or if you made manual changes to the database you should run the following command to refresh the numbers:

```sh
php flarum fof:polls:refresh
```

You can only run the command when the extension is enabled in the admin panel.


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


## Poll Groups Feature

### What Are Poll Groups?

Poll Groups are a feature that allows you to organize multiple polls under a single topic or subject. You can create a group and add related polls to it, making it easier to manage and present a collection of questions about the same theme.

### What Can You Use Poll Groups For?

- **Surveys:** Bundle several polls together to conduct multi-question surveys on a particular subject.
- **Topic-Based Polling:** Group polls by topics, such as feedback on different features, event planning, or research.
- **Community Engagement:** Facilitate deeper discussions by presenting sets of related questions.

### How to Use Poll Groups

1. **Enable Poll Groups:**  
   Make sure the extension setting `Enable poll groups` is enabled in your admin panel.

2. **Permissions:**  
   Poll groups use the following permissions:
    - *View poll groups (`canViewPollGroups`)* : Controls who can see poll groups
    - *Create poll groups*: Controls who can create new poll groups
    - *Moderate poll groups (`polls.moderate_group`)*: Allows moderators to edit and delete any poll groups
    - Individual users can always edit and delete their own poll groups

3. **Creating a Poll Group:**
    - Navigate to the Poll Groups page through the site navigation
    - Click "Start a Poll Group" and provide a name for your group

4. **Adding Polls to Groups:**
    - Go to the poll group detail view
    - Use the "Add Poll" button to create new polls within the group
    - The polls will be automatically associated with and displayed in the group

5. **Managing Poll Groups:**
    - Group creators can edit their group details and delete their own groups
    - Moderators with appropriate permissions can manage any poll groups
    - Deleting a group will remove the group but preserve its associated polls

### Example Use Case

For example, to gather comprehensive feedback about a new feature, create a poll group named "Feature Feedback" and add multiple polls asking about different aspects (usability, design, performance, etc.). Users will find all related polls conveniently grouped together for easy participation.

### Links

[<img src="https://opencollective.com/fof/donate/button@2x.png?color=blue" height="25" />](https://opencollective.com/fof/donate)
[<img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" height="25" />](https://patreon.com/datitisev)

- [Packagist](https://packagist.org/packages/fof/polls)
- [GitHub](https://github.com/packages/FriendsOfFlarum/polls)
- [Discuss](https://discuss.flarum.org/d/20586)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).