import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import LogInModal from 'flarum/forum/components/LogInModal';
import PollOption from '../models/PollOption';
import PollVote from '../models/PollVote';
import ListVotersModal from '../components/ListVotersModal';
import { ApiPayloadSingle } from 'flarum/common/Store';

export default class PollState {
  protected poll: Poll;
  protected pendingSubmit: boolean;
  protected pendingOptions: Set<string> | null;
  public loadingOptions: boolean;
  public useSubmitUI: boolean;
  public showCheckMarks: boolean;

  constructor(poll: Poll) {
    this.poll = poll;
    this.pendingSubmit = false;
    this.pendingOptions = null;
    this.loadingOptions = false;
    this.useSubmitUI = !poll?.canChangeVote() && poll?.allowMultipleVotes();
    this.showCheckMarks = !app.session.user || (!poll.hasEnded() && poll.canVote() && (!this.hasVoted() || poll.canChangeVote()));
  }

  hasVoted() {
    return this.poll.myVotes().length > 0;
  }

  overallVoteCount() {
    return Math.max(
        1,
        this.poll.options().reduce((sum, option) => sum + option!.voteCount(), 0)
    );
  }

  showButton() {
    return this.useSubmitUI && this.pendingSubmit;
  }

  changeVote(option: PollOption, evt: Event) {
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
    m.redraw();
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
        this.showCheckMarks = false;
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
