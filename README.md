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