import { extend } from 'flarum/extend';
import Button from 'flarum/components/Button';
import Component from 'flarum/Component';
import LogInModal from 'flarum/components/LogInModal';

// import ShowVotersModal from './ShowVotersModal';

export default class PollVote extends Component {
    init() {
        this.poll = this.props.poll;
        this.options = this.poll.options() || [];
        this.votes = this.poll.votes() || [];

        this.vote = this.votes.find(v => v.user() && v.user().id() === app.session.user.id());

        this.voted = m.prop(!!this.vote);

        // if (app.session)
    }

    view() {
        return (
            <div>
                <h3>{this.poll.question()}</h3>

                {this.options.map(opt => {
                    const hasVoted = this.voted();
                    const voted = this.vote.id() === opt.id();
                    const votes = this.votes.filter(v => v.option().id() === opt.id()).length;
                    const percent = Math.round((votes / this.poll.votes().length) * 100);

                    return (
                        <div className={`PollOption ${hasVoted && 'PollVoted'}`}>
                            <div
                                title={hasVoted && app.translator.transChoice('fof-polls.forum.tooltip.votes', votes, { count: String(votes) }).join('')}
                                className="PollBar"
                                data-selected={voted}
                                config={function(element) {
                                    $(element).tooltip({ placement: 'right' });
                                }}
                            >
                                {!this.poll.hasEnded() && !this.voted && app.session.user.canVote() && (
                                    <label className="checkbox">
                                        {voted ? (
                                            <input onchange={this.changeVote.bind(this, opt)} type="checkbox" checked />
                                        ) : (
                                            <input onchange={this.changeVote.bind(this, opt)} type="checkbox" />
                                        )}
                                        <span className="checkmark" />
                                    </label>
                                )}

                                <div style={'--width: ' + percent + '%'} className="PollOption-active" />
                                <label style={!this.poll.hasEnded() ? 'margin-left: 25px' : ''} className="PollAnswer">
                                    <span>{opt.answer()}</span>
                                </label>
                                <label>
                                    <span className={percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent'}>{percent}%</span>
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    changeVote(option) {}
}
