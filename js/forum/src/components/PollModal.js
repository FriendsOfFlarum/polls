import {extend} from 'flarum/extend';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import Switch from "flarum/components/Switch";

export default class PollModal extends Modal {
    init() {
        super.init();
        this.answer = [];

        this.question = m.prop(this.props.question || '');
        this.answer[1] = m.prop('');
        this.answer[2] = m.prop('');

        this.endDate = m.prop();
        this.publicPoll = m.prop(false);
    }

    className() {
        return 'PollDiscussionModal Modal--small';
    }

    getMinDateTime() {
        var date = new Date()

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

    title() {
        return app.translator.trans('reflar-polls.forum.modal.add_title');
    }

    config() {
        var oDTP1;

        $('#dtBox').DateTimePicker({
            init: function () {
                oDTP1 = this;
            },
            dateTimeFormat: "yyyy-MM-dd HH:mm",
            minDateTime: this.getMinDateTime(),
            settingValueOfElement: (value) => {
                this.endDate(value)
            }
        });
    }

    content() {
        return [
            <div className="Modal-body">
                <div className="PollDiscussionModal-form">
                    <div>
                        <fieldset>
                            <input type="text" name="question" className="FormControl" bidi={this.question} placeholder={app.translator.trans('reflar-polls.forum.modal.question_placeholder')}/>
                        </fieldset>
                    </div>

                    <h4>{app.translator.trans('reflar-polls.forum.modal.answers')}</h4>

                    {
                        Object.keys(this.answer).map((el, i) => (
                            <div className={this.answer[i + 1] === '' ? 'Form-group hide' : 'Form-group'}>
                                <fieldset className="Poll-answer-input">
                                    <input className="FormControl"
                                           type="text"
                                           name={'answer' + (i + 1)}
                                           bidi={this.answer[i + 1]}
                                           placeholder={app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i + 1)}/>
                                </fieldset>
                                {i + 1 >= 3 ?
                                    Button.component({
                                        type: 'button',
                                        className: 'Button Button--warning Poll-answer-button',
                                        icon: 'minus',
                                        onclick: i + 1 >= 3 ? this.removeOption.bind(this, i + 1) : ''
                                    }) : ''}
                                <div className="clear"></div>
                            </div>
                        ))
                    }

                    {Button.component({
                        className: 'Button Button--primary PollModal-Button',
                        children: app.translator.trans('reflar-polls.forum.modal.add'),
                        onclick: this.addOption.bind(this)
                    })}

                    <div className='Form-group'>
                        <fieldset style="margin-bottom: 15px" className="Poll-answer-input">
                            <input style="opacity: 1" className="FormControl" type="text" data-field="datetime" value={this.endDate() || app.translator.trans('reflar-polls.forum.modal.date_placeholder')} id="dtInput" data-min={this.getMinDateTime()} readonly/>
                            <div id="dtBox"></div>
                        </fieldset>
                        <div className="clear"></div>
                        {Switch.component({
                            state: this.publicPoll() || false,
                            children: app.translator.trans('reflar-polls.forum.modal.switch'),
                            onchange: this.publicPoll
                        })}
                        <div className="clear"></div>
                        {
                            Button.component({
                                type: 'submit',
                                className: 'Button Button--primary PollModal-SubmitButton',
                                children: app.translator.trans('reflar-polls.forum.modal.submit')
                            })
                        }
                    </div>
                </div>
            </div>
        ];
    }

    addOption() {
        if (this.answer.length < 11) {
            this.answer.push(m.prop(''));
        } else {
            alert(app.translator.trans('reflar-polls.forum.modal.max'))
        }
    }

    removeOption(option) {
        this.answer[option] = '';
    }

    onAdd(pollArray) {
        // Add data to DiscussionComposer post data
        extend(DiscussionComposer.prototype, 'data', function (data) {
            data.poll = pollArray;
        });
        extend(DiscussionComposer.prototype, 'headerItems', function (items) {
            items.replace('polls', (
                <a className="DiscussionComposer-changePoll" onclick={this.addPoll}><span className="PollLabel">{app.translator.trans('reflar-polls.forum.composer_discussion.edit')}</span></a>), 1);
        });
    }

    objectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj[key] !== '') size++;
        }
        return size;
    }

    onsubmit(e) {
        e.preventDefault();
        let pollArray = {
            question: this.question(),
            answers: {},
            endDate: new Date(this.endDate()),
            publicPoll: this.publicPoll()
        };

        if (this.question() === '') {
            alert(app.translator.trans('reflar-polls.forum.modal.include_question'))
            return
        }

        // Add answers to PollArray
        Object.keys(this.answer).map((el, i) => {
            var key = (i + 1);
            pollArray['answers'][key - 1] = this.answer[key]()
        });

        if (this.objectSize(pollArray.answers) < 2) {
            alert(app.translator.trans('reflar-polls.forum.modal.min'))
            return
        }

        this.onAdd(pollArray);

        app.modal.close();

        m.redraw.strategy('none');
    }
}