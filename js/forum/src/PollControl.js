import { extend, override } from 'flarum/extend';

import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import PollModal from 'treefiction/polls/components/PollModal';

export default function() {
  extend(PostControls, 'moderationControls', function(items, post) {
      const discussion = post.discussion();

      if (discussion.treefictionPolls() && post.number() == 1) {
        items.add('editPoll', [
          m(Button, {
            icon: 'check-square',
            className: 'treefiction-PollButton',
            onclick: () => {
              app.modal.show(new PollModal({post}));
            }
          }, 'Edit Poll')
        ]);
      }
  });
}
