import {extend, override} from 'flarum/extend';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class EditPollModal extends Modal {
    init() {
        super.init();
        this.answers = this.props.poll.answers();

        this.question = m.prop(this.props.poll.question());

        this.pollCreator = this.props.poll.store.data.users[Object.keys(this.props.poll.store.data.users)[0]]

        this.newAnswer = m.prop('')

        this.endDate = m.prop(this.getDateTime(new Date(this.props.poll.endDate())))
    }

    className() {
        return 'PollDiscussionModal Modal--small';
    }

    title() {
        return app.translator.trans('reflar-polls.forum.modal.edit_title');
    }

    getDateTime(date = new Date()) {
        if (isNaN(date)) {
            date = new Date()
        }
        var checkTargets = [
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        ];

        checkTargets.forEach((target, i) => {
            if (target < 10) {
                checkTargets[i] = "0" + target;
            }
        })

        return date.getFullYear() + '-' + checkTargets[0] + '-' + checkTargets[1] +  ' ' + checkTargets[2] + ':' + checkTargets[3]
    }

    config(isInitalized) {
        if (isInitalized) return;

        var oDTP1;

        $('#dtBox').DateTimePicker({
            init: function () {
                oDTP1 = this;
            },
            dateTimeFormat: "yyyy-MM-dd HH:mm",
            minDateTime: this.getDateTime(),
            settingValueOfElement: (value) => {
                this.endDate(value)
                app.request({
                    method: 'PATCH',
                    url: app.forum.attribute('apiUrl') + '/endDate/' + this.props.poll.id(),
                    data: {
                        date: new Date(value),
                        user_id: this.pollCreator.id()
                    }
                });
            }
        });
    }

    content() {
        return [
            <div className="Modal-body">
                <div className="PollDiscussionModal-form">
                    <div>
                        <fieldset>
                            <input type="text" name="question" className="FormControl" value={this.question()} oninput={m.withAttr('value', this.updateQuestion.bind(this))} placeholder={app.translator.trans('reflar-polls.forum.modal.question_placeholder')}/>
                        </fieldset>
                    </div>

                    <h4>{app.translator.trans('reflar-polls.forum.modal.answers')}</h4>

                    {
                        this.answers.map((answer, i) => (
                            <div className='Form-group'>
                                <fieldset className="Poll-answer-input">
                                    <input className="FormControl"
                                           type="text"
                                           oninput={m.withAttr('value', this.updateAnswer.bind(this, answer))}
                                           value={answer.answer()}
                                           placeholder={app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i + 1)}/>
                                </fieldset>
                                {i + 1 >= 3 ?
                                    Button.component({
                                        type: 'button',
                                        className: 'Button Button--warning Poll-answer-button',
                                        icon: 'minus',
                                        onclick: i + 1 >= 3 ? this.removeOption.bind(this, answer) : ''
                                    }) : ''}
                                <div className="clear"></div>
                            </div>
                        ))
                    }
                    <div className='Form-group'>
                        <fieldset className="Poll-answer-input">
                            <input className="FormControl"
                                   type="text"
                                   oninput={m.withAttr('value', this.newAnswer)}
                                   placeholder={app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (this.answers.length + 1)}/>
                        </fieldset>
                        {Button.component({
                            type: 'button',
                            className: 'Button Button--warning Poll-answer-button',
                            icon: 'plus',
                            onclick: this.addAnswer.bind(this)
                        })}
                    </div>
                    <div className="clear"></div>
                    <div style="margin-top: 20px" className='Form-group'>
                        <fieldset style="margin-bottom: 15px" className="Poll-answer-input">
                            <input style="opacity: 1" className="FormControl" type="text" data-field="datetime" value={this.endDate() || app.translator.trans('reflar-polls.forum.modal.date_placeholder')} id="dtInput" data-min={this.getDateTime()} readonly/>
                            <div id="dtBox"></div>
                        </fieldset>
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        ];
    }


    onhide() {
        this.props.poll.answers = m.prop(this.answers)
        this.props.poll.question = this.question
        this.props.poll.endDate = this.endDate
        m.redraw.strategy('all')
    }

    addAnswer(answer) {
        var data = {
            answer: this.newAnswer(),
            poll_id: this.props.poll.id(),
            user_id: this.pollCreator.id()
        }
        if (this.answers.length < 10) {
            app.store.createRecord('answers').save(data).then(
                answer => {
                    this.answers.push(answer);

                    this.newAnswer('');
                    m.redraw.strategy('all')
                    m.redraw();
                }
            );
        } else {
            alert(app.translator.trans('reflar-polls.forum.modal.max'))
        }
    }


    removeOption(option) {
        app.request({
            method: 'DELETE',
            url: app.forum.attribute('apiUrl') + '/answers/' + option.data.id,
            data: this.pollCreator.id()
        });
        this.answers.some((answer, i) => {
            if (answer.data.id === option.data.id) {
                this.answers.splice(i, 1);
                return true;
            }
        })
    }

    updateAnswer(answerToUpdate, value) {
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/answers/' + answerToUpdate.data.id,
            data: {
                answer: value,
                user_id: this.pollCreator.id()
            }
        });
        this.answers.some((answer) => {
            if (answer.data.id === answerToUpdate.data.id) {
                answer.data.attributes.answer = value;
                return true;
            }
        })
    }

    updateQuestion(question) {
        if (question === '') {
            alert(app.translator.trans('reflar-polls.forum.modal.include_question'))
            this.question('')
            return
        }
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/questions/' + this.props.poll.id(),
            data: {
                question: question,
                user_id: this.pollCreator.id()
            }
        });
        this.question = m.prop(question)
        m.redraw()
    }
}