import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import ListVotersModal from './ListVotersModal';

export default class DiscussionPoll extends Component {
    oninit(vnode) {
        super.oninit(vnode);
        this.poll = this.attrs.poll;

        this.updateData();
    }

    view() {
        const hasVoted = this.myVotes.length > 0;
        const totalVotes = this.poll.voteCount();

        return (
            <div>
                <h3>{this.poll.question()}</h3>

                {this.options.map((opt) => {
                    const voted = this.myVotes.some((vote) => vote.option() === opt);
                    const votes = opt.voteCount();
                    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                    const title = isNaN(votes)
                        ? ''
                        : app.translator.transChoice('fof-polls.forum.tooltip.votes', votes, { count: String(votes) }).join('');

                    return (
                        <div className={`PollOption ${hasVoted && 'PollVoted'} ${this.poll.hasEnded() && 'PollEnded'}`}>
                            <div title={title} className="PollBar" data-selected={voted}>
                                {((!this.poll.hasEnded() && app.session.user && app.session.user.canVotePolls()) || !app.session.user) && (
                                    <label className="checkbox">
                                        <input
                                            onchange={this.changeVote.bind(this, opt)}
                                            type="checkbox"
                                            checked={voted}
                                            disabled={hasVoted && !this.poll.canChangeVote()}
                                        />
                                        <span className="checkmark" />
                                    </label>
                                )}

                                <div style={!isNaN(votes) && '--width: ' + percent + '%'} className="PollOption-active" />
                                <label className="PollAnswer">
                                    <span>{opt.answer()}</span>
                                </label>
                                {!isNaN(votes) && (
                                    <label>
                                        <span className={percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent'}>{percent}%</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    );
                })}

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

                {app.session.user && !app.session.user.canVotePolls() ? (
                    <div className="helpText PollInfoText">{app.translator.trans('fof-polls.forum.no_permission')}</div>
                ) : this.poll.hasEnded() ? (
                    <div className="helpText PollInfoText">{app.translator.trans('fof-polls.forum.poll_ended')}</div>
                ) : this.poll.endDate() !== null ? (
                    <div className="helpText PollInfoText">
                        <i class="icon fa fa-clock-o" />
                        {app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(this.poll.endDate()).fromNow() })}
                    </div>
                ) : (
                    ''
                )}
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

        // if we click on our current vote, we want to "un-vote"
        if (this.myVotes.some((vote) => vote.option() === option)) option = null;

        app.request({
            method: 'PATCH',
            url: `${app.forum.attribute('apiUrl')}/fof/polls/${this.poll.id()}/vote`,
            errorHandler: this.onError.bind(this, evt),
            body: {
                data: {
                    optionId: option ? option.id() : null,
                },
            },
        }).then((res) => {
            app.store.pushPayload(res);

            this.updateData();

            m.redraw();
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
