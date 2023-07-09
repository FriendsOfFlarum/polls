import app from 'flarum/forum/app';

import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import ListVotersModal from './ListVotersModal';
import classList from 'flarum/common/utils/classList';
import Tooltip from 'flarum/common/components/Tooltip';
import EditPollModal from './EditPollModal';

export default class PostPoll extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.poll = this.attrs.poll;

    this.updateData();
  }

  view() {
    const poll = this.poll;
    let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;

    if (maxVotes === 0) maxVotes = this.options.length;

    return (
      <div className="Post-poll">
        <div className="PollHeading">
          <h3 className="PollHeading-title">{poll.question()}</h3>
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

        <div className="PollOptions">{this.options.map(this.viewOption.bind(this))}</div>

        {poll.canSeeVotes()
          ? Button.component(
              {
                className: 'Button Button--primary PublicPollButton',
                onclick: () => this.showVoters(),
              },
              app.translator.trans('fof-polls.forum.public_poll')
            )
          : ''}

        <div className="helpText PollInfoText">
          {app.session.user && !poll.canVote() && (
            <span>
              <i className="icon fas fa-times-circle" />
              {app.translator.trans('fof-polls.forum.no_permission')}
            </span>
          )}
          {poll.endDate() !== null && (
            <span>
              <i class="icon fas fa-clock" />
              {poll.hasEnded()
                ? app.translator.trans('fof-polls.forum.poll_ended')
                : app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() })}
            </span>
          )}

          {poll.canVote() && (
            <span>
              <i className="icon fas fa-poll" />
              {app.translator.trans('fof-polls.forum.max_votes_allowed', { max: maxVotes })}
            </span>
          )}
        </div>
      </div>
    );
  }

  viewOption(opt) {
    const hasVoted = this.myVotes.length > 0;
    const totalVotes = this.poll.voteCount();

    const voted = this.myVotes.some((vote) => vote.option() === opt);
    const votes = opt.voteCount();
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    const canSeeVoteCount = typeof votes === 'number';

    const poll = (
      <div className="PollBar" data-selected={voted}>
        {((!this.poll.hasEnded() && this.poll.canVote()) || !app.session.user) && (
          <label className="checkbox">
            <input onchange={this.changeVote.bind(this, opt)} type="checkbox" checked={voted} disabled={hasVoted && !this.poll.canChangeVote()} />
            <span className="checkmark" />
          </label>
        )}

        <div style={canSeeVoteCount && '--width: ' + percent + '%'} className="PollOption-active" />
        <label className="PollAnswer">
          <span>{opt.answer()}</span>
          {opt.imageUrl() ? <img className="PollAnswerImage" src={opt.imageUrl()} alt={opt.answer()} /> : null}
        </label>
        {canSeeVoteCount && (
          <label>
            <span className={classList('PollPercent', percent !== 100 && 'PollPercent--option')}>{percent}%</span>
          </label>
        )}
      </div>
    );

    return (
      <div className={classList('PollOption', hasVoted && 'PollVoted', this.poll.hasEnded() && 'PollEnded', opt.imageUrl() && 'PollOption-hasImage')}>
        <Tooltip tooltipVisible={canSeeVoteCount ? undefined : false} text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: votes })}>
          {poll}
        </Tooltip>
      </div>
    );
  }

  updateData() {
    this.options = this.poll.options() || [];
    this.myVotes = this.poll.myVotes() || [];
  }

  onError(evt, error) {
    evt.target.checked = false;

    throw error;
  }

  changeVote(option, evt) {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      evt.target.checked = false;
      return;
    }

    // // if we click on our current vote, we want to "un-vote"
    // if (this.myVotes.some((vote) => vote.option() === option)) option = null;

    const optionIds = new Set(this.poll.myVotes().map((v) => v.option().id()));
    const isUnvoting = optionIds.delete(option.id());
    const allowsMultiple = this.poll.allowMultipleVotes();

    if (!allowsMultiple) {
      optionIds.clear();
    }

    if (!isUnvoting) {
      optionIds.add(option.id());
    }

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

        this.updateData();

        m.redraw();
      })
      .catch(() => {
        evt.target.checked = isUnvoting;
      });
  }

  showVoters() {
    // Load all the votes only when opening the votes list
    app.modal.show(ListVotersModal, {
      poll: this.poll,
      post: this.attrs.post,
    });
  }

  deletePoll() {
    if (confirm(app.translator.trans('fof-polls.forum.moderation.delete_confirm'))) {
      this.poll.delete().then(() => {
        m.redraw.sync();
      });
    }
  }
}
