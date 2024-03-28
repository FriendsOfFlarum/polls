import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import LogInModal from 'flarum/forum/components/LogInModal';
import PollOption from '../models/PollOption';
import PollVote from '../models/PollVote';
import ListVotersModal from '../components/ListVotersModal';
import { ApiPayloadSingle } from 'flarum/common/Store';

export default class PollState {
  public poll: Poll;
  protected pendingSubmit: boolean = false;
  protected pendingOptions: Set<string> | null = null;
  public loadingOptions: boolean = false;
  public useSubmitUI: boolean;
  public showCheckMarks: boolean;
  public canSeeVoteCount: boolean;

  constructor(poll: Poll) {
    this.poll = poll;
    this.useSubmitUI = !poll?.canChangeVote() && poll?.allowMultipleVotes();
    this.showCheckMarks = !app.session.user || (!poll.hasEnded() && poll.canVote() && (!this.hasVoted() || poll.canChangeVote()));
    this.canSeeVoteCount = typeof poll.voteCount() === 'number';
    this.init();
  }

  /**
   * used as en extendable entry point for init customizations
   */
  init(): void {}

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
      app.modal.show(LogInModal);
      target.checked = false;
      return;
    }

    const optionIds = this.pendingOptions || new Set(this.poll.myVotes().map((v: PollVote) => v.option()!.id()!));
    const isUnvoting = optionIds.delete(option.id()!);
    const allowsMultiple = this.poll.allowMultipleVotes();

    if (!allowsMultiple) {
      optionIds.clear();
    }

    if (!isUnvoting) {
      optionIds.add(option.id()!);
    }

    this.pendingOptions = optionIds.size ? optionIds : null;
    this.pendingSubmit = !!this.pendingOptions;

    if (this.useSubmitUI) {
      this.pendingOptions = optionIds.size ? optionIds : null;
      this.pendingSubmit = !!this.pendingOptions;
      m.redraw();
      return;
    }

    this.submit(optionIds, null, () => (target.checked = isUnvoting));
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
        url: `${app.forum.attribute('apiUrl')}/fof/polls/${this.poll.id()}/votes`,
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
        this.canSeeVoteCount = typeof this.poll.voteCount() === 'number';
        m.redraw();
      });
  }

  showVoters = () => {
    // Load all the votes only when opening the votes list
    app.modal.show(ListVotersModal, {
      poll: this.poll,
    });
  };
}
