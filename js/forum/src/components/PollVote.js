import {extend} from 'flarum/extend';
import Component from 'flarum/Component';
import classList from 'flarum/utils/classList';
import LogInModal from 'flarum/components/LogInModal'

export default class PollVote extends Component {
    init() {
        this.poll = this.props.poll;
        this.votes = [];
        this.voted = m.prop(false);
        this.user = app.session.user

        this.answers = this.poll ? this.poll.answers() : [];

        if (this.user !== undefined) {
            if (!this.user.canVote()) {
                this.voted(true)
            } else {
                app.store.find('votes', {
                    poll_id: this.poll.id(),
                    user_id: this.user.id()
                }).then((data) => {
                    if (data[0] !== undefined) {
                        this.voted(data[0])
                    }

                    m.redraw();
                });
            }
        }

    }

    voteView() {
        if (this.voted() !== false) {
            return (
                <div>
                    <h4>{this.poll.question()}</h4>
                    {
                        this.answers.map((item) => {
                            let voted = false;
                            if (this.voted() !== true) {
                                voted = this.voted().option_id() === item.data.attributes.id;
                            }
                            const percent = item.percent();
                            return (
                                <div className='PollOption PollVoted'>
                                    <div
                                        title={item.votes() >= 1 ? item.votes() + ' ' + app.translator.trans('reflar-polls.forum.tooltip.vote') : item.votes() + ' ' + app.translator.trans('reflar-polls.forum.tooltip.votes')}
                                        className='PollBar'
                                        data-selected={voted}
                                        config={
                                            function (element) {
                                                $(element).tooltip({placement: 'right'});
                                            }
                                        }>
                                        <div style={'--width: ' + percent + '%'} className="PollOption-active"/>
                                        <label className="PollAnswer"><span>{item.answer()}</span></label>
                                        <label><span className={percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent'}>{percent}%</span></label>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="clear"/>
                    {!this.user.canVote() ? (
                        <div className="helpText">{app.translator.trans('reflar-polls.forum.no_permission')}</div>
                    ) : ''}
                    <div className="clear"/>
                </div>
            );
        } else {
            return (
                <div>
                    <h4>{this.poll.question()}</h4>
                    {
                        this.answers.map((item) => (
                            <div className="PollOption">
                                <div className='PollBar'>
                                    <label className="checkbox">
                                        <input type="checkbox" onchange={this.addVote.bind(this, item.id())}/>
                                        <span>{item.answer()}</span>
                                        <span className="checkmark"/>
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                    <div className="clear"/>
                </div>
            );
        }
    }

    view() {
        let content = this.voteView();

        return (
            <div className={classList({
                voted: this.voted
            })}>
                {content}
            </div>
        );
    }

    addVote(answer, el) {
        if (this.user === undefined) {
            app.modal.show(new LogInModal())
            el.srcElement.checked = false
        } else {
            app.store.createRecord('votes').save({
                poll_id: this.poll.id(),
                option_id: answer
            }).then(() => {
                location.reload()
            })
        }
    }
}
