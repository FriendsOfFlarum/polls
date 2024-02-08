import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import LogInModal from 'flarum/forum/components/LogInModal';
import PollOption from '../models/PollOption';
import PollVote from '../models/PollVote';
import ListVotersModal from '../components/ListVotersModal';

export default class PollState {
  protected poll: Poll;
  protected pendingSubmit: boolean;
  protected pendingOptions: Set<string> | null;
  public loadingOptions: boolean;
  public useSubmitUI: boolean;
  public showCheckMarks: boolean;
  public boundChangeVote: (option: PollOption, evt: Event) => void;

  constructor(poll: Poll) {
    this.poll = poll;
    this.pendingSubmit = false;
    this.pendingOptions = null;
    this.loadingOptions = false;
    this.useSubmitUI = !this.poll?.canChangeVote() && this.poll?.allowMultipleVotes();
    this.showCheckMarks = !app.session.user || (!poll.hasEnded() && poll.canVote() && (!this.hasVoted() || poll.canChangeVote()));
  }

  hasVoted() {
    return this.poll.myVotes().length > 0;
  }

  showButton() {
    return this.useSubmitUI && this.pendingSubmit;
  }

  changeVote(option: PollOption, evt) {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      evt.target.checked = false;
      return;
    }

    const optionIds = this.pendingOptions || new Set(this.poll.myVotes().map?.((v: PollVote) => v.option().id()));
    const isUnvoting = optionIds.delete(option.id());
    const allowsMultiple = this.poll.allowMultipleVotes();

    if (!allowsMultiple) {
      optionIds.clear();
    }

    if (!isUnvoting) {
      optionIds.add(option.id()!);
    }

    if (this.useSubmitUI) {
      this.pendingOptions = optionIds.size ? optionIds : null;
      this.pendingSubmit = !!this.pendingOptions;
      return;
    }

    return this.submit(optionIds, null, () => (evt.target.checked = isUnvoting));
  }

  onsubmit() {
    return this.submit(this.pendingOptions!, () => {
      this.pendingOptions = null;
      this.pendingSubmit = false;
    });
  }

  submit(optionIds: Set<string>, cb: Function | null, onerror: Function | null = null) {
    this.loadingOptions = true;
    m.redraw();

    return app
      .request({
        method: 'PATCH',
        url: `${app.forum.attribute('apiUrl')}/fof/polls/${this.poll.id()}/votes`,
        body: {
          data: {
            optionIds: Array.from(optionIds),
          },
        },
      })
      .then((res) => {
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
    // Load all the votes only when opening the votes list
    app.modal.show(ListVotersModal, {
      poll: this.poll,
    });
  };

  /**
   * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
   * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
   * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
   */
  hideOptionTooltip(vnode) {
    vnode.attrs.tooltipVisible = false;
    vnode.state.updateVisibility();
  }

  /**
   * Alert before navigating away using browser's 'beforeunload' event
   */
  preventClose = (e: Event): boolean | void => {
    if (this.pendingOptions) {
      e.preventDefault();
      return true;
    }
  };
}
