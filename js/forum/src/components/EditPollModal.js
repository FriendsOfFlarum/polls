import {extend, override} from 'flarum/extend';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class EditPollModal extends Modal {
    init() {
        super.init();
        this.answers = this.props.poll.answers();

        this.question = m.prop(this.props.poll.question());

        this.newAnswer = m.prop('')
    }

    className() {
        return 'PollDiscussionModal Modal--small';
    }

    title() {
        return app.translator.trans('reflar-polls.forum.modal.edit_title');
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
                                           value={answer.data.attributes.answer}
                                           placeholder={app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i+1)}/>
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
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        ];
    }

    addAnswer(answer) {
        if (this.answers.length < 10) {
            app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/answers',
                data: {
                    answer: this.newAnswer(),
                    poll_id: this.props.poll.id()
                }
            }).then(
                response => {
                    this.answers.push(response);

                    this.newAnswer('');
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
            url: app.forum.attribute('apiUrl') + '/answers/' + option.data.id
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
            data: value
        });
        this.answers.some((answer) => {
            if (answer.data.id === answerToUpdate.data.id) {
                answer.data.attributes.answer = value;
                return true;
            }
        })
    }

    onhide() {
        location.reload()
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
            data: question
        });
        this.question = m.prop(question)
        m.redraw()
    }
}