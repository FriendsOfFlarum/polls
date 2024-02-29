import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import classList from 'flarum/common/utils/classList';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';
import CreatePollModal from './components/CreatePollModal';
import Poll from './models/Poll';
import PollOption from './models/PollOption';
import { ModelAttributes } from 'flarum/common/Model';
import PollModelAttributes from "./models/PollModelAttributes";

function toPoll(data: PollModelAttributes) {
  if (data) {
    const poll = app.store.createRecord<Poll>('polls');

    poll.tempOptions = data.options.map((option: ModelAttributes) => {
      const pollOption = app.store.createRecord<PollOption>('poll_options');
      pollOption.pushAttributes(option);
      return pollOption;
    });
    poll.pushAttributes(data);

    return poll;
  }
  return data;
}

export const addToComposer = (composer: ComponentClass) => {
  // @ts-ignore
  composer.prototype.addPoll = function () {
    app.modal.show(CreatePollModal, {
      poll: toPoll(this.composer.fields.poll),
      onsubmit: (poll: PollModelAttributes) => (this.composer.fields.poll = poll),
    });
  };

  // Add button to DiscussionComposer header
  extend(composer.prototype, 'headerItems', function (items) {
    const discussion = this.composer.body?.attrs?.discussion;

    // @ts-ignore
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
