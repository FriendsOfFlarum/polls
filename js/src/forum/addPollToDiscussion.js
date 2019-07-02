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
};
