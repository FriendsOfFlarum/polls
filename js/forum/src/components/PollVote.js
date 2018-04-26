import {extend, override} from 'flarum/extend';
import Component from 'flarum/Component';
import classList from 'flarum/utils/classList';
import LogInModal from 'flarum/components/LogInModal'

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
        }
    }

    voteView() {

        if (this.voted() !== false) {
            return (
                <div>
                    <h4>{this.poll.question()}</h4>
                    {
                        this.answers.map((item) => {
                            if (this.voted().option_id() === item.data.attributes.id) {
                                var color = app.forum.data.attributes.themePrimaryColor
                            } else {
                                var color = app.forum.data.attributes.themeSecondaryColor
                            }
                            return (
                                <div className='PollOption PollVoted'>
                                    <div className='PollBar' style={this.voted().option_id() === item.data.attributes.id ? 'border-color: ' + color : ''}>
                                        <div style={'width: ' + item.percent() + '%; background:' + color} className="PollOption-active"></div>
                                        <label><span style={this.calculateColor(color)}>{item.answer()}</span></label>
                                        <label><span style={'color: #000000'} className='PollPercent'>{item.percent()}%</span></label>
                                    </div>
                                </div>
                            )
                        })
                    }
                    < div className="clear"></div>
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

    calculateColor(hex) {
        const [r, g, b] = [0, 2, 4].map(p => parseInt(hex.replace('#', '').substr(p, 2), 16));
        return (((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128) ? 'color: #000000' : 'color: #ffffff';
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
        if (app.session.user === undefined) {
            app.modal.show(new LogInModal())
            return
        } else {
            app.store.createRecord('votes').save({
                poll_id: this.poll.id(),
                user_id: app.session.user.id(),
                option_id: answer
            }).then(() => {
                window.location.reload()
            })
        }
    }
}
