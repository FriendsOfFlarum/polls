import { extend, override } from 'flarum/extend';

import CommentPost from 'flarum/components/CommentPost';
import PollVote from 'treefiction/polls/components/PollVote';

export default function() {
  extend(CommentPost.prototype, 'content', function(content) {
    const discussion = this.props.post.discussion(); 

    if (discussion.treefictionPolls() && this.props.post.number() == 1 && !this.props.post.isHidden()) {
      this.subtree.invalidate();
        
      content.push(PollVote.component({
        poll: discussion.treefictionPolls()
      }));
    }
  });
}
