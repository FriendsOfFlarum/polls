import {extend} from 'flarum/extend';
import Button from 'flarum/components/Button';
import Component from 'flarum/Component';
import classList from 'flarum/utils/classList';
import LogInModal from 'flarum/components/LogInModal';

import ShowVotersModal from './ShowVotersModal';

export default class PollVote extends Component {
    init() {
        this.poll = this.props.poll;
        this.votes = [];
        this.voted = m.prop(false);
        this.user = app.session.user;

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
                    } else if (this.poll.isEnded()) {
                        this.voted(true)
                    }

                    m.redraw();
                });
            }
        }

    }

    showVoters() {
        app.modal.show(new ShowVotersModal(this.poll))
    }

    voteView() {

        if (this.voted() !== false) {
            return (
                <div>
                    <h3>{this.poll.question()}</h3>
                    {this.answers.map((item) => {
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
                                    {!this.poll.isEnded() && this.voted !== true ?
                                        <label className="checkbox">
                                            {voted ?
                                                <input onchange={this.changeVote.bind(this, item.id())} type="checkbox" checked/>
                                                :
                                                <input onchange={this.changeVote.bind(this, item.id())} type="checkbox"/>
                                            }
                                            <span className="checkmark"/>
                                        </label>
                                        : ''}
                                    <div style={'--width: ' + percent + '%'} className="PollOption-active"/>
                                    <label style={!this.poll.isEnded() ? "margin-left: 25px" : ''} className="PollAnswer"><span>{item.answer()}</span></label>
                                    <label><span className={percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent'}>{percent}%</span></label>
                                </div>
                            </div>
                        )
                    })
                    }
                    <div className="clear"/>
                    {this.poll.isPublic() ?
                        Button.component({
                            className: 'Button Button--primary PublicPollButton',
                            children: app.translator.trans('reflar-polls.forum.public_poll'),
                            onclick: () => {
                                app.modal.show(new ShowVotersModal(this.poll))
                            }
                        }) : ''}
                    <div className="clear"/>
                    {!this.user.canVote() ? (
                        <div className="helpText PollInfoText">{app.translator.trans('reflar-polls.forum.no_permission')}</div>
                    ) : this.poll.isEnded() ? (
                        <div className="helpText PollInfoText">{app.translator.trans('reflar-polls.forum.poll_ended')}</div>
                    ) : !isNaN(new Date(this.poll.endDate())) ? (
                        <div className="helpText PollInfoText">
                            <i class="icon fa fa-clock-o"></i> {app.translator.trans('reflar-polls.forum.days_remaining', {time: moment(this.poll.endDate()).fromNow()})}
                        </div>
                    ) : ''}
                    <div className="clear"/>
                </div>
            );

        } else {
            return (
                <div>
                    <h3>{this.poll.question()}</h3>
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
                    {this.poll.isPublic() && app.session.user !== undefined ?
                        Button.component({
                            className: 'Button Button--primary PublicPollButton',
                            children: app.translator.trans('reflar-polls.forum.public_poll'),
                            onclick: () => {
                                app.modal.show(new ShowVotersModal(this.poll))
                            }
                        }) : ''}
                    {this.poll.isEnded() ? (
                        <div className="helpText PollInfoText">{app.translator.trans('reflar-polls.forum.poll_ended')}</div>
                    ) : !isNaN(new Date(this.poll.endDate())) ? (
                        <div className="helpText PollInfoText">
                            <i class="icon fa fa-clock-o"></i> {app.translator.trans('reflar-polls.forum.days_remaining', {time: moment(this.poll.endDate()).fromNow()})}
                        </div>
                    ) : ''}
                </div>
            );
        }
    }

    onError(el, error) {
        el.srcElement.checked = false

        app.alerts.show(error.alert)
    }

    changeVote(answer, el) {
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/votes/' + answer,
            errorHandler: this.onError.bind(this, el),
            data: {
                option_id: answer,
                poll_id: this.poll.id()
            }
        }).then(() => {
            location.reload()
        });
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
