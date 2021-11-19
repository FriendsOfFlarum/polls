import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import classList from 'flarum/common/utils/classList';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';

import CreatePollModal from './components/CreatePollModal';

export default () => {
  DiscussionComposer.prototype.addPoll = function () {
    app.modal.show(CreatePollModal, {
      poll: this.poll,
      onsubmit: (poll) => (this.poll = poll),
    });
  };

  // Add button to DiscussionComposer header
  extend(DiscussionComposer.prototype, 'headerItems', function (items) {
    if (app.session.user && app.session.user.canStartPolls()) {
      items.add(
        'polls',
        <a className="DiscussionComposer-poll" onclick={this.addPoll.bind(this)}>
          <span className={classList('PollLabel', !this.poll && 'none')}>
            {app.translator.trans(`fof-polls.forum.composer_discussion.${this.poll ? 'edit' : 'add'}_poll`)}
          </span>
        </a>,
        1
      );
    }
  });

  extend(DiscussionComposer.prototype, 'data', function (data) {
    if (this.poll) {
      data.poll = this.poll;
    }
  });
};
