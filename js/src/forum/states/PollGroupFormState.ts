import app from 'flarum/forum/app';
import PollGroup from '../models/PollGroup';
import PollGroupControls from '../utils/PollGroupControls';

export default class PollGroupFormState {
  pollGroup: PollGroup;
  loading: boolean = false;
  deleting: boolean = false;

  static createNewPollGroup(): PollGroup {
    const pollGroup = app.store.createRecord<PollGroup>('poll_groups');

    pollGroup.pushAttributes({ name: '' });

    return pollGroup;
  }

  constructor(pollGroup: PollGroup) {
    this.pollGroup = pollGroup || PollGroupFormState.createNewPollGroup();
  }

  async save(data: any): Promise<void> {
    this.loading = true;
    m.redraw();

    try {
      this.pollGroup = await this.pollGroup.save(data);
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  async delete(): Promise<void> {
    this.loading = true;
    m.redraw();

    try {
      await PollGroupControls.deleteAction(this.pollGroup);
      this.deleting = !this.pollGroup.exists;
    } finally {
      this.loading = false;
      m.redraw();
    }
  }
}
