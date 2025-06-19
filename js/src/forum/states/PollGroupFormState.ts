import app from 'flarum/forum/app';
import PollGroup from '../models/PollGroup';
import PollGroupControls from '../utils/PollGroupControls';

export default class PollGroupFormState {
  pollGroup: PollGroup;
  loading: boolean;
  deleting: boolean;

  static createNewPollGroup() {
    const pollGroup = app.store.createRecord<PollGroup>('poll-groups');

    pollGroup.pushAttributes({
      name: '',
    });

    return pollGroup;
  }

  constructor(pollGroup: PollGroup) {
    if (!pollGroup) {
      pollGroup = PollGroupFormState.createNewPollGroup();
    }

    this.loading = false;
    this.deleting = false;
    this.pollGroup = pollGroup;
  }

  async save(data: any) {
    this.loading = true;
    m.redraw();

    try {
      this.pollGroup = await this.pollGroup.save(data);
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  async delete() {
    if (!confirm(app.translator.trans(`fof-polls.forum.pollgroup_controls.delete_confirmation`) as string)) {
      return;
    }

    this.loading = true;
    m.redraw();

    const pollGroup = this.pollGroup;

    try {
      await pollGroup
        .delete()
        .then(() => {
          this.deleting = true;
          PollGroupControls.showDeletionAlert(pollGroup, 'success');
        })
        .catch(() => PollGroupControls.showDeletionAlert(pollGroup, 'error'));
    } finally {
      this.loading = false;
      m.redraw();
    }
  }
}
