import app from 'flarum/forum/app';

import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import ListVotersModal from './ListVotersModal';
import classList from 'flarum/common/utils/classList';
import Tooltip from 'flarum/common/components/Tooltip';
import EditPollModal from './EditPollModal';

export default class PostPoll extends Component {
  view() {
    const poll = this.attrs.poll;
    const options = poll.options() || [];
    let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;

    if (maxVotes === 0) maxVotes = options.length;

    return (
      <div className="Post-poll" data-id={poll.id()}>
        <div className="PollHeading">
          <h3 className="PollHeading-title">{poll.question()}</h3>

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

        <div className="PollOptions">{options.map(this.viewOption.bind(this))}</div>

        <div className="helpText PollInfoText">
          {app.session.user && !poll.canVote() && !poll.hasEnded() && (
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
    const poll = this.attrs.poll;
    const hasVoted = poll.myVotes()?.length > 0;
    const totalVotes = poll.voteCount();

    const voted = poll.myVotes()?.some?.((vote) => vote.option() === opt);
    const votes = opt.voteCount();
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    const canSeeVoteCount = typeof votes === 'number';

    const bar = (
      <div className="PollBar" data-selected={voted}>
        {((!poll.hasEnded() && poll.canVote()) || !app.session.user) && (
          <label className="checkbox">
            <input onchange={this.changeVote.bind(this, opt)} type="checkbox" checked={voted} disabled={hasVoted && !poll.canChangeVote()} />
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
      <div
        className={classList('PollOption', hasVoted && 'PollVoted', poll.hasEnded() && 'PollEnded', opt.imageUrl() && 'PollOption-hasImage')}
        data-id={opt.id()}
      >
        <Tooltip tooltipVisible={canSeeVoteCount ? undefined : false} text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: votes })}>
          {bar}
        </Tooltip>
      </div>
    );
  }

  changeVote(option, evt) {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      evt.target.checked = false;
      return;
    }

    const optionIds = new Set(this.attrs.poll.myVotes().map?.((v) => v.option().id()));
    const isUnvoting = optionIds.delete(option.id());
    const allowsMultiple = this.attrs.poll.allowMultipleVotes();

    if (!allowsMultiple) {
      optionIds.clear();
    }

    if (!isUnvoting) {
      optionIds.add(option.id());
    }

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

        m.redraw();
      })
      .catch(() => {
        evt.target.checked = isUnvoting;
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
    if (confirm(app.translator.trans('fof-polls.forum.moderation.delete_confirm'))) {
      this.attrs.poll.delete().then(() => {
        m.redraw.sync();
      });
    }
  }
}
