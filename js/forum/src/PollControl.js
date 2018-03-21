import { extend, override } from 'flarum/extend';

import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import PollModal from 'treefiction/polls/components/PollModal';

export default function() {
  extend(PostControls, 'moderationControls', function(items, post) {
    const discussion = post.discussion();
    const poll = discussion.treefictionPolls();

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

      items.add('removePoll', [
        m(Button, {
          icon: 'trash',
          className: 'treefiction-PollButton',
          onclick: () => {
            var message = confirm('Are you sure you want to delete this poll?');

            if (message == true) {
              app.request({
                url: app.forum.attribute('apiUrl') + poll.apiEndpoint() + '/' + poll.id(),
                method: 'DELETE',
                poll
              });

              location.reload();
            }
          }
        }, 'Remove Poll')
      ]);
    }
  });
}
