import Button from 'flarum/components/Button';
import Modal from 'flarum/components/Modal';
import Switch from 'flarum/components/Switch';
import Stream from 'flarum/utils/Stream';
import flatpickr from 'flatpickr';

export default class CreatePollModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.options = [Stream(''), Stream('')];

        this.question = Stream('');

        this.endDate = Stream();

        this.publicPoll = Stream(false);

        if (this.props.poll) {
            const poll = this.attrs.poll;

            this.options = poll.relationships.options.map(o => Stream(o));
            this.question(poll.question);
            this.endDate(!poll.endDate || isNaN(poll.endDate.getTime()) ? null : poll.endDate);
            this.publicPoll(poll.publicPoll);
        }
    }

    title() {
        return app.translator.trans('fof-polls.forum.modal.add_title');
    }

    className() {
        return 'PollDiscussionModal Modal--small';
    }

    configDatePicker(vnode) {

        flatpickr(vnode.dom, {
            enableTime: true,
            minDate: this.endDate() || 'today',
            dateFormat: 'Y-m-d H:i',
            defaultDate: this.endDate(),
            wrap: true,

            onChange: dates => this.endDate(dates[0]),
        });
    }

    content() {
        return [
            <div className="Modal-body">
                <div className="PollDiscussionModal-form">
                    <div className="Form-group">
                        <label className="label">{app.translator.trans('fof-polls.forum.modal.question_placeholder')}</label>

                        <input type="text" name="question" className="FormControl" bidi={this.question} />
                    </div>

                    <div className="PollModal--answers Form-group">
                        <label className="label PollModal--answers-title">
                            <span>{app.translator.trans('fof-polls.forum.modal.options_label')}</span>

                            {Button.component({
                                className: 'Button PollModal--button small',
                                icon: 'fas fa-plus',
                                onclick: this.addOption.bind(this),
                            })}
                        </label>

                        {this.displayOptions()}
                    </div>

                    <div className="Form-group">
                        <label className="label">{app.translator.trans('fof-polls.forum.modal.date_placeholder')}</label>

                        <div className="PollModal--date" oncreate={this.configDatePicker.bind(this)}>
                            <input style="opacity: 1; color: inherit" className="FormControl" data-input />
                            {Button.component({
                                className: 'Button PollModal--button',
                                icon: 'fas fa-times',
                                'data-clear': true,
                            })}
                        </div>
                    </div>

                    <div className="Form-group">
                        {Switch.component({
                            state: this.publicPoll() || false,
                            onchange: this.publicPoll,
                        }, app.translator.trans('fof-polls.forum.modal.public_poll_label'))}
                    </div>

                    <div className="Form-group">
                        {Button.component({
                            type: 'submit',
                            className: 'Button Button--primary PollModal-SubmitButton',
                            loading: this.loading,
                        }, app.translator.trans('fof-polls.forum.modal.submit'))}
                    </div>
                </div>
            </div>,
        ];
    }

    displayOptions() {
        return Object.keys(this.options).map((el, i) => (
            <div className={this.options[i + 1] === '' ? 'Form-group hide' : 'Form-group'}>
                <fieldset className="Poll-answer-input">
                    <input
                        className="FormControl"
                        type="text"
                        name={'answer' + (i + 1)}
                        bidi={this.options[i]}
                        placeholder={app.translator.trans('fof-polls.forum.modal.option_placeholder') + ' #' + (i + 1)}
                    />
                </fieldset>
                {i >= 2
                    ? Button.component({
                          type: 'button',
                          className: 'Button Button--warning PollModal--button',
                          icon: 'fas fa-minus',
                          onclick: i >= 2 ? this.removeOption.bind(this, i) : '',
                      })
                    : ''}
            </div>
        ));
    }

    addOption() {
        const setting = app.data['fof-polls.options.max'];
        const max = (setting && parseInt(setting)) || 11;

        if (this.options.length < max) {
            this.options.push(Stream(''));
        } else {
            alert(app.translator.trans('fof-polls.forum.modal.max'));
        }
    }

    removeOption(option) {
        this.options.splice(option, 1);
    }

    onsubmit(e) {
        e.preventDefault();

        const poll = {
            question: this.question(),
            endDate: this.endDate(),
            publicPoll: this.publicPoll(),
        };
        const options = this.options.map(a => a()).filter(Boolean);

        if (this.question() === '') {
            alert(app.translator.trans('fof-polls.forum.modal.include_question'));

            return;
        }

        if (options.length < 2) {
            alert(app.translator.trans('fof-polls.forum.modal.min'));

            return;
        }

        poll.relationships = { options };

        this.attrs.onsubmit(poll);

        app.modal.close();
    }
}
