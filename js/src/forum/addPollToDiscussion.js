import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';
import Stream from 'flarum/utils/Stream';
import DiscussionPoll from './components/DiscussionPoll';

// import PollVote from './components/PollVote';

export default () => {
    extend(CommentPost.prototype, 'content', function(content) {
        const discussion = this.attrs.post.discussion();

        if (discussion.poll() && this.attrs.post.number() === 1) {
            content.push(
                DiscussionPoll.component({
                    poll: discussion.poll(),
                })
            );
        }
    });

    extend(CommentPost.prototype, 'oncreate', function(context) {

        if (app.pusher) {
            app.pusher.then(channels => {
                channels.main.bind('newPollVote', data => {
                    var userId = parseInt(data['user_id']);

                    if (userId == app.session.user.id()) return;

                    let poll = app.store.getById(
                        'polls',
                        this.attrs.post
                            .discussion()
                            .poll()
                            .id()
                    );

                    if (parseInt(poll.id()) === parseInt(data['poll_id'])) {

                        let vote = {};

                        Object.keys(data).map(key => {
                            vote[key] = Stream(data[key]);
                        });

                        vote['option'] = Stream(app.store.getById('poll_options', data['option_id']));
                        vote['user'] = Steram(app.store.getById('users', data['user_id']));

                        let newVotes = poll.votes();

                        newVotes.some((vote, i) => {
                            if (parseInt(vote.user().id()) === userId) {
                                newVotes.splice(i, 1);
                            }
                        });

                        newVotes.push(vote);

                        poll.votes = Stream(newVotes);

                        m.redraw.sync();
                    }
                });

                extend(context, 'onunload', () => channels.main.unbind('newPollVote'));
            });
        }
    });
};
