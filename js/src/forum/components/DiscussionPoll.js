import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import LogInModal from 'flarum/components/LogInModal';

import ListVotersModal from './ListVotersModal';
import Stream from 'flarum/utils/Stream';
export default class PollVote extends Component {
    oninit(vdom) {
        this.poll = this.attrs.poll;

        this.vote = Stream();
        this.voted = Stream(false);

        this.updateData();
    }

    view() {
        return (
            <div>
                <h3>{this.poll.question()}</h3>

                {this.options.map(opt => {
                    const hasVoted = this.voted();
                    const voted =
                        this.vote() &&
                        this.vote()
                            .option()
                            .id() === opt.id();
                    const votes = this.votes.filter(v => v.option().id() === opt.id()).length;
                    const percent = Math.round((votes / this.poll.votes().length) * 100);

                    const attrs = voted
                        ? {
                              title:
                                  hasVoted && app.translator.transChoice('fof-polls.forum.tooltip.votes', votes, { count: String(votes) }).join(''),
                              config: function(element) {
                                  $(element).tooltip({ placement: 'right' });
                              },
                          }
                        : {};

                    const inputAttrs = voted
                        ? {
                              checked: true,
                          }
                        : {};

                    return (
                        <div className={`PollOption ${hasVoted && 'PollVoted'} ${this.poll.hasEnded() && 'PollEnded'}`}>
                            <div {...attrs} className="PollBar" data-selected={voted}>
                                {((!this.poll.hasEnded() && app.session.user && app.session.user.canVotePolls()) || !app.session.user) && (
                                    <label className="checkbox">
                                        <input onchange={this.changeVote.bind(this, opt)} type="checkbox" {...inputAttrs} />
                                        <span className="checkmark" />
                                    </label>
                                )}

                                <div style={hasVoted && '--width: ' + percent + '%'} className="PollOption-active" />
                                <label className="PollAnswer">
                                    <span>{opt.answer()}</span>
                                </label>
                                {hasVoted && (
                                    <label>
                                        <span className={percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent'}>{percent}%</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div style="clear: both;" />

                {this.poll.publicPoll()
                    ? Button.component({
                          className: 'Button Button--primary PublicPollButton',
                          onclick: () => this.showVoters(),
                      }, app.translator.trans('fof-polls.forum.public_poll'))
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
        this.poll = app.store.getById('polls', this.poll.id());
        this.options = this.poll.options() || [];
        this.votes = this.poll.votes() || [];

        this.vote(app.session.user ? this.votes.find(v => v.user() && v.user().id() === app.session.user.id()) : null);

        this.voted(!!this.vote());
    }

    onError(evt, error) {
        evt.target.checked = false;

        app.alerts.show(error.alert);
    }

    changeVote(option, evt) {
        if (!app.session.user) {
            app.modal.show(LogInModal);
            evt.target.checked = false;
            return;
        }

        if (
            this.vote() &&
            option.id() ===
                this.vote()
                    .option()
                    .id()
        )
            option = null;

        if (!this.vote()) {
            this.vote(app.store.createRecord('poll_votes'));

            this.vote().pollId(this.poll.id());
        }

        m.startComputation();

        app.request({
            method: 'PATCH',
            url: `${app.forum.attribute('apiUrl')}/fof/polls/${this.poll.id()}/vote`,
            errorHandler: this.onError.bind(this, evt),
            data: {
                data: {
                    optionId: option ? option.id() : null,
                },
            },
        }).then(res => {
            app.store.pushPayload(res);

            if (!option) app.store.remove(this.vote());

            this.updateData();

            if (!option) {
                //m.redraw.strategy('all');
                m.redraw.sync();
                //m.redraw.strategy('diff');
            }

            m.endComputation();
        });
    }

    showVoters() {
        app.modal.show(
            ListVotersModal, {
                poll: this.poll,
            }
        );
    }
}
