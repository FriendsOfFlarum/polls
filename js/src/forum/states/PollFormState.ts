import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import PollOption from '../models/PollOption';

export default class PollFormState {
  poll: Poll;
  loading: boolean;
  deleting: boolean;
  expandedGroup: string;
  private baseline: Record<string, unknown> = {};

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

    poll.tempOptions = [app.store.createRecord<PollOption>('poll_options'), app.store.createRecord<PollOption>('poll_options')];

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
    this.captureBaseline();
  }

  captureBaseline(): void {
    const rawEndDate = this.poll.endDate?.();
    // Flarum's `transformDate` turns empty strings into `new Date('')`
    // which is Invalid — `toISOString()` on Invalid throws RangeError.
    const endDate =
      rawEndDate instanceof Date && !isNaN(rawEndDate.getTime()) ? rawEndDate.toISOString() : null;

    this.baseline = {
      question: this.poll.question(),
      subtitle: this.poll.subtitle?.(),
      endDate,
      publicPoll: this.poll.publicPoll?.(),
      allowMultipleVotes: this.poll.allowMultipleVotes?.(),
      hideVotes: this.poll.hideVotes?.(),
      allowChangeVote: this.poll.allowChangeVote?.(),
      maxVotes: this.poll.maxVotes?.(),
      imageAlt: this.poll.imageAlt?.(),
      options: (this.poll.tempOptions ?? this.poll.options()).map((o: any) => [o.answer?.(), o.imageUrl?.()]),
    };
  }

  dirty(current: Record<string, unknown>): boolean {
    return JSON.stringify(current) !== JSON.stringify(this.baseline);
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
      /**
       * Cleanup attributes:
       * For the saving process, we add the options directly to the attributes.
       * As we currently cannot add new PollOptions as relationships.
       */
      delete this.poll!.data!.attributes!.options;
      this.captureBaseline();
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
