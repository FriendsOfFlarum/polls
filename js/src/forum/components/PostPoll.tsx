import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import ListVotersModal from './ListVotersModal';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';
import Tooltip from 'flarum/common/components/Tooltip';
import icon from 'flarum/common/helpers/icon';
import EditPollModal from './EditPollModal';
import Poll from '../models/Poll';
import type Mithril from 'mithril';
import PollOption from '../models/PollOption';
import Post from 'flarum/common/models/Post';
import extractText from 'flarum/common/utils/extractText';
import PollImage from './Poll/PollImage';

export interface PostPollAttrs extends ComponentAttrs {
  poll: Poll;
  post?: Post;
}

export default class PostPoll extends Component<PostPollAttrs> {
  loadingOptions: boolean = false;
  useSubmitUI!: boolean;
  pendingSubmit: boolean = false;
  pendingOptions: any;

  oninit(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    super.oninit(vnode);

    this.useSubmitUI = !this.attrs.poll?.canChangeVote() && this.attrs.poll?.allowMultipleVotes();
    this.pendingOptions = null;
  }

  oncreate(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    super.oncreate(vnode);

    this.preventClose = this.preventClose.bind(this);
    window.addEventListener('beforeunload', this.preventClose);
  }

  onremove(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    super.onremove(vnode);

    window.removeEventListener('beforeunload', this.preventClose);
  }

  view() {
    const poll = this.attrs.poll;
    const options = poll.options() || [];
    let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;

    if (maxVotes === 0) maxVotes = options.length;

    const infoItems = this.infoItems(maxVotes);

    return (
      <div className="Post-poll" data-id={poll.id()}>
        <div className="PollHeading">
          <div className="PollHeading-title-container">
            <h3 className="PollHeading-title">{poll.question()}</h3>
            {poll.subtitle() && <p className="helpText PollHeading-subtitle">{poll.subtitle()}</p>}
          </div>

          <div className="PollHeading-actions">
            {poll.canSeeVoters() && (
              <Tooltip text={app.translator.trans('fof-polls.forum.public_poll')}>
                <Button className="Button PollHeading-voters" onclick={this.showVoters.bind(this)} icon="fas fa-poll" />
              </Tooltip>
            )}

            {poll.canEdit() && (
              <Tooltip text={app.translator.trans('fof-polls.forum.moderation.edit')}>
                <Button className="Button PollHeading-edit" onclick={app.modal.show.bind(app.modal, EditPollModal, { poll })} icon="fas fa-pen" />
              </Tooltip>
            )}
            {poll.canDelete() && (
              <Tooltip text={app.translator.trans('fof-polls.forum.moderation.delete')}>
                <Button className="Button PollHeading-delete" onclick={this.deletePoll.bind(this)} icon="fas fa-trash" />
              </Tooltip>
            )}
          </div>
        </div>

        {!!poll.imageUrl() && <PollImage poll={poll} />}

        <div>
          <div className="PollOptions">{options.map(this.viewOption.bind(this))}</div>

          <div className="Poll-sticky">
            {!infoItems.isEmpty() && <div className="helpText PollInfoText">{infoItems.toArray()}</div>}

            {this.useSubmitUI && this.pendingSubmit && (
              <Button className="Button Button--primary Poll-submit" loading={this.loadingOptions} onclick={this.onsubmit.bind(this)}>
                {app.translator.trans('fof-polls.forum.poll.submit_button')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  infoItems(maxVotes: number) {
    const items = new ItemList();
    const poll = this.attrs.poll;
    const hasVoted = poll.myVotes()?.length > 0;

    if (app.session.user && !poll.canVote() && !poll.hasEnded()) {
      items.add(
        'no-permission',
        <span>
          <i className="icon fas fa-times-circle fa-fw" />
          {app.translator.trans('fof-polls.forum.no_permission')}
        </span>
      );
    }

    if (poll.endDate()) {
      items.add(
        'end-date',
        <span>
          <i class="icon fas fa-clock fa-fw" />
          {poll.hasEnded()
            ? app.translator.trans('fof-polls.forum.poll_ended')
            : app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() })}
        </span>
      );
    }

    if (poll.canVote()) {
      items.add(
        'max-votes',
        <span>
          <i className="icon fas fa-poll fa-fw" />
          {app.translator.trans('fof-polls.forum.max_votes_allowed', { max: maxVotes })}
        </span>
      );

      if (!poll.canChangeVote()) {
        items.add(
          'cannot-change-vote',
          <span>
            <i className={`icon fas fa-${hasVoted ? 'times' : 'exclamation'}-circle fa-fw`} />
            {app.translator.trans('fof-polls.forum.poll.cannot_change_vote')}
          </span>
        );
      }
    }

    return items;
  }

  viewOption(opt: PollOption) {
    const poll = this.attrs.poll;
    const hasVoted = poll.myVotes()?.length > 0;
    const totalVotes = poll.voteCount();

    const voted = this.pendingOptions ? this.pendingOptions.has(opt.id()) : poll.myVotes()?.some?.((vote) => vote.option() === opt);
    const votes = opt.voteCount();
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    const canSeeVoteCount = typeof votes === 'number';
    const isDisabled = this.loadingOptions || (hasVoted && !poll.canChangeVote());
    const width = canSeeVoteCount ? percent : (Number(voted) / (poll.myVotes()?.length || 1)) * 100;

    const showCheckmark = !app.session.user || (!poll.hasEnded() && poll.canVote() && (!hasVoted || poll.canChangeVote()));

    const bar = (
      <div className="PollBar" data-selected={!!voted} style={`--poll-option-width: ${width}%`}>
        {showCheckmark && (
          <label className="PollAnswer-checkbox">
            <input onchange={this.changeVote.bind(this, opt)} type="checkbox" checked={voted} disabled={isDisabled} />
            <span className="checkmark" />
          </label>
        )}

        <div className="PollAnswer-text">
          <span className="PollAnswer-text-answer">{opt.answer()}</span>
          {voted && !showCheckmark && icon('fas fa-check-circle', { className: 'PollAnswer-check' })}
          {canSeeVoteCount && <span className={classList('PollPercent', percent !== 100 && 'PollPercent--option')}>{percent}%</span>}
        </div>

        {opt.imageUrl() ? <img className="PollAnswer-image" src={opt.imageUrl()} alt={opt.answer()} loading="lazy" /> : null}
      </div>
    );

    return (
      <div
        className={classList('PollOption', hasVoted && 'PollVoted', poll.hasEnded() && 'PollEnded', opt.imageUrl() && 'PollOption-hasImage')}
        data-id={opt.id()}
      >
        {canSeeVoteCount ? (
          <Tooltip text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: votes })} onremove={this.hideOptionTooltip}>
            {bar}
          </Tooltip>
        ) : (
          bar
        )}
      </div>
    );
  }

  changeVote(option: PollOption, evt: Event) {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      evt.target.checked = false;
      return;
    }

    const optionIds = this.pendingOptions || new Set(this.attrs.poll.myVotes().map?.((v) => v.option().id()));
    const isUnvoting = optionIds.delete(option.id());
    const allowsMultiple = this.attrs.poll.allowMultipleVotes();

    if (!allowsMultiple) {
      optionIds.clear();
    }

    if (!isUnvoting) {
      optionIds.add(option.id());
    }

    if (this.useSubmitUI) {
      this.pendingOptions = optionIds.size ? optionIds : null;
      this.pendingSubmit = !!this.pendingOptions;
      return;
    }

    return this.submit(optionIds, null, () => (evt.target.checked = isUnvoting));
  }

  onsubmit() {
    return this.submit(this.pendingOptions, () => {
      this.pendingOptions = null;
      this.pendingSubmit = false;
    });
  }

  submit(optionIds, cb, onerror) {
    this.loadingOptions = true;
    m.redraw();

    return app
      .request({
        method: 'PATCH',
        url: `${app.forum.attribute('apiUrl')}/fof/polls/${this.attrs.poll.id()}/votes`,
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

  showVoters() {
    // Load all the votes only when opening the votes list
    app.modal.show(ListVotersModal, {
      poll: this.attrs.poll,
      post: this.attrs.post,
    });
  }

  deletePoll() {
    if (confirm(extractText(app.translator.trans('fof-polls.forum.moderation.delete_confirm')))) {
      this.attrs.poll.delete().then(() => {
        m.redraw.sync();
      });
    }
  }

  /**
   * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
   * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
   * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
   */
  hideOptionTooltip(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    vnode.attrs.tooltipVisible = false;
    vnode.state.updateVisibility();
  }

  /**
   * Alert before navigating away using browser's 'beforeunload' event
   */
  preventClose(e) {
    if (this.pendingOptions) {
      e.preventDefault();
      return true;
    }
  }
}
