import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import DiscussionPoll from './components/DiscussionPoll';

export default () => {
    extend(CommentPost.prototype, 'content', function (content) {
        const discussion = this.attrs.post.discussion();

        if (discussion.poll() && this.attrs.post.number() === 1) {
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

            // Make the post redraw everytime the poll or option vote count changed, or when the user vote changed
            return JSON.stringify([
                discussion.poll().voteCount(),
                (discussion.poll().myVotes() || []).map((vote) => vote.option().id()),
                discussion
                    .poll()
                    .options()
                    .map((option) => option.voteCount()),
            ]);
        });
    });

    extend(CommentPost.prototype, 'oncreate', function (call, vnode) {
        if (app.pusher) {
            app.pusher.then((channels) => {
                // We will listen for updates to all polls and options
                // Even if that model is not in the current discussion, it doesn't really matter
                channels.main.bind('updatedPollOption', (data) => {
                    const poll = app.store.getById('polls', data['pollId']);

                    if (poll) {
                        poll.pushAttributes({
                            voteCount: data['pollVoteCount'],
                        });

                        // Not redrawing here, as the option below should trigger the redraw already
                    }

                    const option = app.store.getById('poll_options', data['optionId']);

                    if (option) {
                        option.pushAttributes({
                            voteCount: data['optionVoteCount'],
                        });

                        m.redraw();
                    }
                });

                extend(vnode, 'onremove', () => channels.main.unbind('updatedPollOption'));
            });
        }
    });
};
