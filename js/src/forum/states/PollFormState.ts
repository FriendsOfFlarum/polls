import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import PollOption from '../models/PollOption';

export default class PollFormState {
  poll: Poll;
  loading: boolean = false;
  deleting: boolean = false;
  dirty: boolean = false;

  static createNewPoll(): Poll {
    const poll = app.store.createRecord<Poll>('polls');

    poll.pushAttributes({
      question: '',
      endDate: '',
      publicPoll: false,
      allowMultipleVotes: false,
      hideVotes: false,
      allowChangeVote: false,
      maxVotes: 0,
    });

    poll.tempOptions = [app.store.createRecord<PollOption>('poll_options'), app.store.createRecord<PollOption>('poll_options')];

    return poll;
  }

  constructor(poll: Poll) {
    this.poll = poll || PollFormState.createNewPoll();
  }

  isNew(): boolean {
    return !this.poll.exists;
  }

  isDraft(): boolean {
    return this.poll.exists && this.poll.isDraft();
  }

  markDirty(value: boolean = true): void {
    this.dirty = value;
  }

  async save(data: any): Promise<void> {
    this.loading = true;
    m.redraw();

    try {
      this.poll = await this.poll.save(data);

      // Options are sent as attributes because new PollOptions cannot be
      // saved as relationships yet; they would linger on the model otherwise.
      delete this.poll!.data!.attributes!.options;
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  async delete(): Promise<void> {
    this.loading = true;
    m.redraw();

    try {
      await this.poll.delete();
      this.deleting = true;
    } finally {
      this.loading = false;
      m.redraw();
    }
  }
}
