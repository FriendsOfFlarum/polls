import app from 'flarum/forum/app';
import Poll from '../models/Poll';

export default class PollFormState {
  poll: Poll;
  loading: boolean;
  deleting: boolean;
  expandedGroup: string;

  static createNewPoll() {
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
    poll.pushData({ relationships: { options: [] } });
    return poll;
  }

  constructor(poll: Poll) {
    if (!poll) {
      poll = PollFormState.createNewPoll();
    }

    this.loading = false;
    this.deleting = false;
    this.poll = poll;
    this.expandedGroup = 'setup';
  }

  isExpanded(groupKey: string) {
    return this.expandedGroup === groupKey;
  }

  expand(groupKey: string) {
    this.expandedGroup = groupKey;
    m.redraw();
  }

  async save(data: any) {
    this.loading = true;
    m.redraw();

    try {
      this.poll = await this.poll.save(data);
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  async delete() {
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