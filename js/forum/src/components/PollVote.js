import {extend, override} from 'flarum/extend';
import Component from 'flarum/Component';
import classList from 'flarum/utils/classList';

export default class PollVote extends Component {
    init() {
        this.poll = this.props.poll;
        this.votes = [];
        this.voted = m.prop(false);

        this.answers = this.poll ? this.poll.answers() : [];

        if (app.session.user !== undefined) {
            app.store.find('votes', {
                poll_id: this.poll.id(),
                user_id: app.session.user.id()
            }).then((data) => {
                if (data[0] !== undefined) {
                    this.voted(data[0])
                }

                m.redraw();
            });
        } else {
            this.voted = true;
        }
    }

    voteView() {

        if (this.voted() !== false) {
            return (
                <div>
                    <h4>{this.poll.question()}</h4>
                    {
                        this.answers.map((item) => (
                            <div className='PollOption PollVoted'>
                                <div className='PollBar' style={this.voted().option_id() === item.data.attributes.id ? 'border-color: ' + app.forum.data.attributes.themePrimaryColor : ''}>
                                    {this.voted().option_id() === item.data.attributes.id ? (
                                        <div style={'width: ' + item.percent() + '%; background:' + app.forum.data.attributes.themePrimaryColor} className="PollOption-active"></div>
                                    ) : (
                                        <div style={' width: ' + item.percent() + '%; background:' + app.forum.data.attributes.themeSecondaryColor} className="PollOption-active"></div>
                                    )
                                    }
                                    {}
                                    <label><span>{item.answer()}</span></label>
                                    <label><span className='PollPercent'>{item.percent()}%</span></label>
                                </div>
                            </div>
                        ))
                    }
                    <div className="clear"></div>
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
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                    <div className="clear"></div>
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

    addVote(answer) {
        app.store.createRecord('votes').save({
            poll_id: this.poll.id(),
            user_id: app.session.user.id(),
            option_id: answer
        }).then(() => {
            window.location.reload()
        })

    }
}
