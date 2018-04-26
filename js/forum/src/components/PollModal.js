import {extend, override} from 'flarum/extend';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import DiscussionComposer from 'flarum/components/DiscussionComposer';

export default class PollModal extends Modal {
    init() {
        super.init();
        this.answer = [];

        this.question = m.prop(this.props.question || '');
        this.answer[1] = m.prop('');
        this.answer[2] = m.prop('');
    }

    className() {
        return 'PollDiscussionModal Modal--small';
    }

    title() {
        return 'Add a poll';
    }

    content() {
        return [
            <div className="Modal-body">
                <div className="PollDiscussionModal-form">
                    <div>
                        <fieldset>
                            <input type="text" name="question" className="FormControl" bidi={this.question} placeholder="Ask a question"/>
                        </fieldset>
                    </div>

                    <h4>Answers</h4>

                    {
                        Object.keys(this.answer).map((el, i) => (
                            <div className={this.answer[i + 1] === '' ? 'Form-group hide' : 'Form-group'}>
                                <fieldset className="Poll-answer-input">
                                    <input className="FormControl"
                                           type="text"
                                           name={'answer' + (i + 1)}
                                           bidi={this.answer[i + 1]}
                                           placeholder={this.choicePlaceholder()}/>
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

                    <a href="javascript:;" onclick={this.addOption.bind(this)}><span class="TagLabel untagged">+ Add an option</span></a><br/><br/>

                    <div className='Form-group'>
                        <div className="clear"></div>

                        {
                            Button.component({
                                type: 'submit',
                                className: 'Button Button--primary',
                                children: 'Submit'
                            })
                        }
                    </div>
                </div>
            </div>
        ];
    }

    choicePlaceholder() {
        return 'Option';
    }

    addOption() {
        if (this.answer.length < 11) {
            this.answer.push(m.prop(''));
        } else {
            alert('You can have a maximum of 10 answers')
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

        // Change the text of add poll button to edit poll
        if (this.question() !== '') {
            extend(DiscussionComposer.prototype, 'headerItems', function (items) {
                items.replace('polls', (
                    <a className="DiscussionComposer-changeTags" onclick={this.addPoll}><span className="TagLabel">Edit poll</span></a>), 1);
            });
        }
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
        };

        if (this.question() === '') {
            alert('You must include a question')
            return
        }

        // Add answers to PollArray
        Object.keys(this.answer).map((el, i) => {
            var key = (i + 1);
            pollArray['answers'][key-1] = this.answer[key]()
        });

        if (this.objectSize(pollArray.answers) < 2) {
            alert('You must include a minimum of 2 answers')
            return
        }

        this.onAdd(pollArray);

        app.modal.close();

        m.redraw.strategy('none');
    }
}