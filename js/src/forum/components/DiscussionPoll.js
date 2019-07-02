import Component from 'flarum/Component';

// import ShowVotersModal from './ShowVotersModal';

export default class PollVote extends Component {
    init() {
        this.poll = this.props.poll;

        this.vote = m.prop();
        this.voted = m.prop(false);

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
                        <div className={`PollOption ${hasVoted && 'PollVoted'}`}>
                            <div {...attrs} className="PollBar" data-selected={voted}>
                                {!this.poll.hasEnded() && app.session.user.canVotePolls() && (
                                    <label className="checkbox">
                                        <input onchange={this.changeVote.bind(this, opt)} type="checkbox" {...inputAttrs} />
                                        <span className="checkmark" />
                                    </label>
                                )}

                                <div style={hasVoted && '--width: ' + percent + '%'} className="PollOption-active" />
                                <label style={!this.poll.hasEnded() ? 'margin-left: 25px' : ''} className="PollAnswer">
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
            </div>
        );
    }

    updateData() {
        this.poll = app.store.getById('polls', this.poll.id());
        this.options = this.poll.options() || [];
        this.votes = this.poll.votes() || [];

        this.vote(this.votes.find(v => v.user() && v.user().id() === app.session.user.id()));

        this.voted(!!this.vote());
    }

    onError(el, error) {
        el.srcElement.checked = false;

        app.alerts.show(error.alert);
    }

    changeVote(option, el) {
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
            errorHandler: this.onError.bind(this, el),
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
                m.redraw.strategy('all');
                m.redraw();
                m.redraw.strategy('diff');
            }

            m.endComputation();
        });
    }
}
