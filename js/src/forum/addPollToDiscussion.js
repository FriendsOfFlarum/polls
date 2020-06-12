import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';

import DiscussionPoll from './components/DiscussionPoll';

// import PollVote from './components/PollVote';

export default () => {
    extend(CommentPost.prototype, 'content', function(content) {
        const discussion = this.props.post.discussion();

        if (discussion.poll() && this.props.post.number() === 1) {
            content.push(
                DiscussionPoll.component({
                    poll: discussion.poll(),
                })
            );
        }
    });

    extend(CommentPost.prototype, 'config', function(x, isInitialized, context) {
        if (isInitialized) return;

        if (app.pusher) {
            app.pusher.then(channels => {
                channels.main.bind('newPollVote', data => {
                    var userId = parseInt(data['user_id']);

                    if (userId == app.session.user.id()) return;

                    let poll = app.store.getById(
                        'polls',
                        this.props.post
                            .discussion()
                            .poll()
                            .id()
                    );

                    if (parseInt(poll.id()) === parseInt(data['poll_id'])) {
                        m.startComputation();

                        let vote = {};

                        Object.keys(data).map(key => {
                            vote[key] = m.prop(data[key]);
                        });

                        vote['option'] = m.prop(app.store.getById('poll_options', data['option_id']));
                        vote['user'] = m.prop(app.store.getById('users', data['user_id']));

                        let newVotes = poll.votes();

                        newVotes.some((vote, i) => {
                            if (parseInt(vote.user().id()) === userId) {
                                newVotes.splice(i, 1);
                            }
                        });

                        newVotes.push(vote);

                        poll.votes = m.prop(newVotes);

                        m.redraw.strategy('all');

                        m.endComputation();
                    }
                });

                extend(context, 'onunload', () => channels.main.unbind('newPollVote'));
            });
        }
    });
};
