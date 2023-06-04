import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import DiscussionPoll from './components/DiscussionPoll';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';

export default () => {
  extend(CommentPost.prototype, 'content', function (content) {
    const discussion = this.attrs.post.discussion();

    // If the options aren't loaded, it means we jumped from homepage to a profile page and are missing relationships
    // We will simply not show the poll in that situation
    if (discussion.poll() && Array.isArray(discussion.poll().options()) && this.attrs.post.number() === 1) {
      content.push(
        DiscussionPoll.component({
          discussion,
          poll: discussion.poll(),
        })
      );
    }
  });

  extend(CommentPost.prototype, 'oninit', function () {
    this.subtree.check(() => {
      const discussion = this.attrs.post.discussion();

      if (!discussion.poll() || this.attrs.post.number() !== 1) {
        return '';
      }

      const checks = [
        // Make the post redraw everytime the poll or option vote count changed, or when the user vote changed
        discussion.poll().voteCount(),
        (discussion.poll().myVotes() || []).map((vote) => vote.option().id()),
      ];

      const options = discussion.poll().options();

      // The options might not be loaded in all contexts where CommentPost is rendered (for example, user profile),
      // if they are missing we are just going to omit this check
      if (options) {
        checks.push(options.map((option) => option.voteCount()));
      }

      return JSON.stringify(checks);
    });
  });

  extend(DiscussionPage.prototype, 'oncreate', function () {
    if (app.pusher) {
      app.pusher.then((binding) => {
        // We will listen for updates to all polls and options
        // Even if that model is not in the current discussion, it doesn't really matter
        binding.channels.main.bind('updatedPollOptions', (data) => {
          const poll = app.store.getById('polls', data['pollId']);

          if (poll) {
            poll.pushAttributes({
              voteCount: data['pollVoteCount'],
            });

            // Not redrawing here, as the option below should trigger the redraw already
          }

          const changedOptions = data['options'];

          for (const optionId in changedOptions) {
            const option = app.store.getById('poll_options', optionId);

            if (option) {
              option.pushAttributes({
                voteCount: changedOptions[optionId],
              });
            }
          }

          m.redraw();
        });
      });
    }
  });

  extend(DiscussionPage.prototype, 'onremove', function () {
    if (app.pusher) {
      app.pusher.then((binding) => {
        binding.channels.main.unbind('updatedPollOptions');
      });
    }
  });
};
