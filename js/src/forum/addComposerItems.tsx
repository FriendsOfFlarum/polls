import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import classList from 'flarum/common/utils/classList';
import Button from 'flarum/common/components/Button';
import Poll from './models/Poll';
import PollOption from './models/PollOption';
import { ModelAttributes } from 'flarum/common/Model';
import PollModelAttributes from './models/PollModelAttributes';

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

function addPoll(composer: any) {
  app.modal.show(() => import('./components/CreatePollModal'), {
    poll: toPoll(composer.composer.fields.poll),
    onsubmit: (poll: PollModelAttributes) => (composer.composer.fields.poll = poll),
  });
}

export const addToComposer = (composerPath: string) => {
  extend(composerPath, 'headerItems', function (this: any, items) {
    const discussion = this.composer.body?.attrs?.discussion;

    const canStartPoll = discussion?.canStartPoll() ?? app.forum.attribute<boolean>('canStartPolls');

    if (canStartPoll) {
      items.add(
        'polls',
        <Button className="ComposerBody-poll Button Button--ua-reset" onclick={() => addPoll(this)}>
          <span className={classList('PollLabel', !this.composer.fields.poll && 'none')}>
            {app.translator.trans(`fof-polls.forum.composer_discussion.${this.composer.fields.poll ? 'edit' : 'add'}_poll`)}
          </span>
        </Button>,
        1
      );
    }
  });

  extend(composerPath, 'data', function (this: any, data) {
    if (this.composer.fields.poll) {
      data.poll = this.composer.fields.poll;
    }
  });
};

export default () => {
  addToComposer('flarum/forum/components/DiscussionComposer');
  addToComposer('flarum/forum/components/ReplyComposer');
};
