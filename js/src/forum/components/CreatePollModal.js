import Button from 'flarum/components/Button';
import Modal from 'flarum/components/Modal';
import Switch from 'flarum/components/Switch';

import flatpickr from 'flatpickr';

export default class CreatePollModal extends Modal {
    init() {
        super.init();

        this.options = [m.prop(''), m.prop('')];

        this.question = m.prop('');

        this.endDate = m.prop();

        this.publicPoll = m.prop(false);

        if (this.props.poll) {
            const poll = this.props.poll;

            this.options = poll.relationships.options.map(o => m.prop(o));
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

    configDatePicker(el, isInitialized) {
        if (isInitialized) return;

        flatpickr(el, {
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

                        <div className="PollModal--date" config={this.configDatePicker.bind(this)}>
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
                            children: app.translator.trans('fof-polls.forum.modal.public_poll_label'),
                            onchange: this.publicPoll,
                        })}
                    </div>

                    <div className="Form-group">
                        {Button.component({
                            type: 'submit',
                            className: 'Button Button--primary PollModal-SubmitButton',
                            children: app.translator.trans('fof-polls.forum.modal.submit'),
                            loading: this.loading,
                        })}
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
                          className: 'Button Button--warning Poll-option-button',
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
            this.options.push(m.prop(''));
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

        this.props.onsubmit(poll);

        app.modal.close();
    }
}
