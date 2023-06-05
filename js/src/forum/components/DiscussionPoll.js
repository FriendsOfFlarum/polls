import app from 'flarum/forum/app';

import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import ListVotersModal from './ListVotersModal';
import classList from 'flarum/common/utils/classList';
import Tooltip from 'flarum/common/components/Tooltip';

export default class DiscussionPoll extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.poll = this.attrs.poll;

    this.updateData();
  }

  view() {
    let maxVotes = this.poll.allowMultipleVotes() ? this.poll.maxVotes() : 1;

    if (maxVotes === 0) maxVotes = this.options.length;

    return (
      <div>
        <h3>{this.poll.question()}</h3>

        {this.options.map(this.viewOption.bind(this))}

        <div style="clear: both;" />

        {this.poll.canSeeVotes()
          ? Button.component(
              {
                className: 'Button Button--primary PublicPollButton',
                onclick: () => this.showVoters(),
              },
              app.translator.trans('fof-polls.forum.public_poll')
            )
          : ''}

        <div className="helpText PollInfoText">
          {app.session.user && !app.session.user.canVotePolls() && (
            <span>
              <i className="icon fas fa-times-circle" />
              {app.translator.trans('fof-polls.forum.no_permission')}
            </span>
          )}
          {this.poll.hasEnded() && (
            <span>
              <i class="icon fas fa-clock" />
              {app.translator.trans('fof-polls.forum.poll_ended')}
            </span>
          )}
          {this.poll.endDate() !== null && (
            <span>
              <i class="icon fas fa-clock" />
              {app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(this.poll.endDate()).fromNow() })}
            </span>
          )}

          {app.session.user?.canVotePolls() && (
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

    const poll = (
      <div className="PollBar" data-selected={voted}>
        {((!this.poll.hasEnded() && app.session.user && app.session.user.canVotePolls()) || !app.session.user) && (
          <label className="checkbox">
            <input onchange={this.changeVote.bind(this, opt)} type="checkbox" checked={voted} disabled={hasVoted && !this.poll.canChangeVote()} />
            <span className="checkmark" />
          </label>
        )}

        <div style={!isNaN(votes) && '--width: ' + percent + '%'} className="PollOption-active" />
        <label className="PollAnswer">
          <span>{opt.answer()}</span>
          {opt.imageUrl() ? <img className="PollAnswerImage" src={opt.imageUrl()} alt={opt.answer()} /> : null}
        </label>
        {!isNaN(votes) && (
          <label>
            <span className={classList('PollPercent', percent !== 100 && 'PollPercent--option')}>{percent}%</span>
          </label>
        )}
      </div>
    );

    return (
      <div className={classList('PollOption', hasVoted && 'PollVoted', this.poll.hasEnded() && 'PollEnded')}>
        {!isNaN(votes) ? <Tooltip text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: votes })}>{poll}</Tooltip> : poll}
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
    app.store
      .find('discussions', this.attrs.discussion.id(), {
        include: 'poll.votes,poll.votes.user,poll.votes.option',
      })
      .then(() => {
        app.modal.show(ListVotersModal, {
          poll: this.poll,
        });
      });
  }
}
