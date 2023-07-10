import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import PostPoll from './components/PostPoll';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';

export default () => {
  extend(CommentPost.prototype, 'content', function (content) {
    const post = this.attrs.post;

    if (post.polls()) {
      for (const poll of post.polls()) {
        if (poll) {
          content.push(<PostPoll post={post} poll={poll} />);
        }
      }
    }
  });

  extend(CommentPost.prototype, 'oninit', function () {
    this.subtree.check(() => {
      const polls = this.attrs.post.polls();

      const checks = polls?.map?.(
        (poll) =>
          poll && [
            poll.data?.attributes,
            poll.options().map?.((option) => option?.data?.attributes),
            poll.myVotes().map?.((vote) => vote.option()?.id()),
          ]
      );

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

            if (option && option.voteCount() !== undefined) {
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
