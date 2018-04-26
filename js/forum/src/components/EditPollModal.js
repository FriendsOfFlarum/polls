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
        return 'Edit poll';
    }

    content() {
        return [
            <div className="Modal-body">
                <div className="PollDiscussionModal-form">
                    <div>
                        <fieldset>
                            <input type="text" name="question" className="FormControl" value={this.question()} oninput={m.withAttr('value', this.updateQuestion.bind(this))} placeholder="Ask a question"/>
                        </fieldset>
                    </div>

                    <h4>Answers</h4>

                    {
                        this.answers.map((answer, i) => (
                            <div className='Form-group'>
                                <fieldset className="Poll-answer-input">
                                    <input className="FormControl"
                                           type="text"
                                           oninput={m.withAttr('value', this.updateAnswer.bind(this, answer))}
                                           value={answer.data.attributes.answer}
                                           placeholder={this.choicePlaceholder()}/>
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
                                   placeholder={this.choicePlaceholder()}/>
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

    choicePlaceholder() {
        return 'Option';
    }

    addAnswer(answer) {
        if (this.answers.length < 11) {
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
            alert('You can have a maximum of 10 answers')
        }
    }

    removeOption(option) {
        app.request({
            method: 'DELETE',
            url: app.forum.attribute('apiUrl') + '/answers/' + option.id()
        });
        this.answers.some((answer, i) => {
            if (answer.id() === option.id()) {
                this.answers.splice(i, 1);
                return true;
            }
        })
    }

    updateAnswer(answerToUpdate, value) {
        if (value === '') {
            alert('You must include a question')
            return
        }
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/answers/' + answerToUpdate.id(),
            data: value
        });
        this.answers.some((answer) => {
            if (answer.id() === answerToUpdate.id()) {
                answer.data.attributes.answer = value;
                return true;
            }
        })
    }

    updateQuestion(question) {
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/questions/' + this.props.poll.id(),
            data: question
        });
        this.question = m.prop(question)
        m.redraw()
    }
}