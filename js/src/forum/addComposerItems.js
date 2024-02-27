import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import classList from 'flarum/common/utils/classList';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';

import CreatePollModal from './components/CreatePollModal';

function toPoll(data) {
  if (data) {
    const poll = app.store.createRecord('polls');
    poll.pushAttributes(data);
    poll.pushData({
      relationships: {
        options: data.options.map((option) => {
          const pollOption = app.store.createRecord('poll_options');
          pollOption.pushAttributes(option);
          return pollOption;
        }),
      },
    });
    return poll;
  }
  return data;
}

export const addToComposer = (composer) => {
  composer.prototype.addPoll = function () {
    app.modal.show(CreatePollModal, {
      poll: toPoll(this.composer.fields.poll),
      onsubmit: (poll) => (this.composer.fields.poll = poll),
    });
  };

  // Add button to DiscussionComposer header
  extend(composer.prototype, 'headerItems', function (items) {
    const discussion = this.composer.body?.attrs?.discussion;
    const canStartPoll = discussion?.canStartPoll() ?? app.forum.canStartPolls();

    if (canStartPoll) {
      items.add(
        'polls',
        <a className="ComposerBody-poll" onclick={this.addPoll.bind(this)}>
          <span className={classList('PollLabel', !this.composer.fields.poll && 'none')}>
            {app.translator.trans(`fof-polls.forum.composer_discussion.${this.composer.fields.poll ? 'edit' : 'add'}_poll`)}
          </span>
        </a>,
        1
      );
    }
  });

  extend(composer.prototype, 'data', function (data) {
    if (this.composer.fields.poll) {
      data.poll = this.composer.fields.poll;
    }
  });
};

export default () => {
  addToComposer(DiscussionComposer);
  addToComposer(ReplyComposer);
};
