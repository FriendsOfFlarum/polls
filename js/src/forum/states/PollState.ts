import app from 'flarum/forum/app';
import Post from 'flarum/common/models/Post';
import { ApiPayloadSingle } from 'flarum/common/Store';
import Poll from '../models/Poll';
import PollOption from '../models/PollOption';
import PollVote from '../models/PollVote';

export default class PollState {
  public poll: Poll;
  public post?: Post;
  public loadingOptions: boolean = false;
  protected pendingSubmit: boolean = false;
  protected pendingOptions: Set<string> | null = null;

  constructor(poll: Poll, post?: Post) {
    this.poll = poll;
    this.post = post;
    this.init();
  }

  init(): void {}

  // The server omits the count entirely while votes are hidden, so its
  // absence is the permission check.
  get canSeeVoteCount(): boolean {
    return typeof this.poll.voteCount() === 'number';
  }

  get useSubmitUI(): boolean {
    return !this.poll.canChangeVote() && this.poll.allowMultipleVotes();
  }

  canSelect(): boolean {
    if (this.loadingOptions || this.poll.hasEnded()) return false;

    // Guests get a live control: clicking it asks them to log in.
    if (!app.session.user) return true;

    if (!this.poll.canVote()) return false;

    return !this.hasVoted() || this.poll.canChangeVote();
  }

  isShowResult(): boolean {
    return this.poll.hasEnded() || (this.canSeeVoteCount && !!app.session.user && this.hasVoted());
  }

  hasVoted(): boolean {
    return this.poll.myVotes().length > 0;
  }

  overallVoteCount(): number {
    return this.poll.voteCount();
  }

  hasVotedFor(option: PollOption): boolean {
    return this.pendingOptions ? this.pendingOptions.has(option.id()!) : this.poll.myVotes().some((vote: PollVote) => vote.option() === option);
  }

  getMaxVotes(): number {
    const poll = this.poll;
    let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;

    if (maxVotes === 0) maxVotes = poll.options().length;

    return maxVotes;
  }

  showButton(): boolean {
    return this.useSubmitUI && this.pendingSubmit;
  }

  changeVote(option: PollOption, evt: Event): void {
    const target = evt.target as HTMLInputElement;

    if (!app.session.user) {
      app.modal.show(() => import('flarum/forum/components/LogInModal'));
      target.checked = false;
      return;
    }

    const optionIds = this.pendingOptions || new Set(this.poll.myVotes().map((v: PollVote) => v.option()!.id()!));
    const isUnvoting = optionIds.delete(option.id()!);

    if (!this.poll.allowMultipleVotes()) {
      optionIds.clear();
    }

    if (!isUnvoting) {
      optionIds.add(option.id()!);
    }

    this.pendingOptions = optionIds.size ? optionIds : null;
    this.pendingSubmit = !!this.pendingOptions;

    if (this.useSubmitUI) {
      m.redraw();
      return;
    }

    this.submit(
      optionIds,
      () => {
        this.pendingOptions = null;
        this.pendingSubmit = false;
      },
      () => (target.checked = isUnvoting)
    );
  }

  hasSelectedOptions(): boolean {
    return this.pendingSubmit;
  }

  onsubmit(): Promise<void> {
    return this.submit(this.pendingOptions!, () => {
      this.pendingOptions = null;
      this.pendingSubmit = false;
    });
  }

  submit(optionIds: Set<string>, cb: Function | null, onerror: Function | null = null) {
    this.loadingOptions = true;
    m.redraw();

    return app
      .request<ApiPayloadSingle>({
        method: 'PATCH',
        url: `${app.forum.attribute('apiUrl')}/polls/${this.poll.id()}/votes`,
        body: {
          data: {
            optionIds: Array.from(optionIds),
          },
        },
      })
      .then((res: ApiPayloadSingle) => {
        app.store.pushPayload(res);
        cb?.();
      })
      .catch((err) => {
        onerror?.(err);
      })
      .finally(() => {
        this.loadingOptions = false;
        m.redraw();
      });
  }

  showVoters = () => {
    app.modal.show(() => import('../components/ListVotersModal'), {
      poll: this.poll,
      post: this.post,
    });
  };
}
