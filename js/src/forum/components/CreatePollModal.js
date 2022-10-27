import app from 'flarum/forum/app';

import Button from 'flarum/common/components/Button';
import Modal from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import flatpickr from 'flatpickr';

export default class CreatePollModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.options = [Stream(''), Stream('')];
    this.optionImageUrls = [Stream(''), Stream('')];

    this.question = Stream('');

    this.endDate = Stream();

    this.publicPoll = Stream(false);

    const {poll} = this.attrs;

    // When re-opening the modal for the same discussion composer where we already set poll attributes
    if (poll && Array.isArray(poll.options)) {
      this.options = [];
      this.optionImageUrls = [];
      poll.options.forEach(option => {
        this.options.push(Stream(option.answer));
        this.optionImageUrls.push(Stream(option.imageUrl));
      });

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

      onChange: (dates) => this.endDate(dates[0]),
    });
  }

  content() {
    return [
      <div className="Modal-body">
        <div className="PollDiscussionModal-form">
          {this.fields().toArray()}
        </div>
      </div>,
    ];
  }

  fields() {
    const items = new ItemList();

    items.add('question', <div className="Form-group">
      <label className="label">{app.translator.trans('fof-polls.forum.modal.question_placeholder')}</label>

      <input type="text" name="question" className="FormControl" bidi={this.question} />
    </div>, 100);

    items.add('answers', <div className="PollModal--answers Form-group">
      <label className="label PollModal--answers-title">
        <span>{app.translator.trans('fof-polls.forum.modal.options_label')}</span>

        {Button.component({
          className: 'Button PollModal--button small',
          icon: 'fas fa-plus',
          onclick: this.addOption.bind(this),
        })}
      </label>

      {this.displayOptions()}
    </div>, 80);

    items.add('date', <div className="Form-group">
      <label className="label">{app.translator.trans('fof-polls.forum.modal.date_placeholder')}</label>

      <div className="PollModal--date" oncreate={this.configDatePicker.bind(this)}>
        <input style="opacity: 1; color: inherit" className="FormControl" data-input />
        {Button.component({
          className: 'Button PollModal--button',
          icon: 'fas fa-times',
          'data-clear': true,
        })}
      </div>
    </div>, 40);

    items.add('public', <div className="Form-group">
      {Switch.component(
        {
          state: this.publicPoll() || false,
          onchange: this.publicPoll,
        },
        app.translator.trans('fof-polls.forum.modal.public_poll_label')
      )}
    </div>, 20);

    items.add('submit', <div className="Form-group">
      {Button.component(
        {
          type: 'submit',
          className: 'Button Button--primary PollModal-SubmitButton',
          loading: this.loading,
        },
        app.translator.trans('fof-polls.forum.modal.submit')
      )}
    </div>, -10);

    return items;
  }

  displayOptions() {
    return Object.keys(this.options).map((el, i) => (
      <div className="Form-group">
        <fieldset className="Poll-answer-input">
          <input
            className="FormControl"
            type="text"
            name={'answer' + (i + 1)}
            bidi={this.options[i]}
            placeholder={app.translator.trans('fof-polls.forum.modal.option_placeholder') + ' #' + (i + 1)}
          />
          <input
            className="FormControl"
            type="text"
            name={'answerImage' + (i + 1)}
            bidi={this.optionImageUrls[i]}
            placeholder={app.translator.trans('fof-polls.forum.modal.image_option_placeholder') + ' #' + (i + 1)}
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
      this.optionImageUrls.push(Stream(''));
    } else {
      alert(app.translator.trans('fof-polls.forum.modal.max'));
    }
  }

  removeOption(option) {
    this.options.splice(option, 1);
    this.optionImageUrls.splice(option, 1);
  }

  data() {
    const poll = {
      question: this.question(),
      endDate: this.endDate(),
      publicPoll: this.publicPoll(),
      options: [],
    };

    this.options.forEach((answer, index) => {
      if (answer()) {
        poll.options.push({
          answer: answer(),
          imageUrl: this.optionImageUrls[index](),
        });
      }
    });

    if (this.question() === '') {
      alert(app.translator.trans('fof-polls.forum.modal.include_question'));

      return null;
    }

    if (poll.options.length < 2) {
      alert(app.translator.trans('fof-polls.forum.modal.min'));

      return null;
    }

    return poll;
  }

  onsubmit(e) {
    e.preventDefault();

    const data = this.data();

    if (data === null) {
      return;
    }

    this.attrs.onsubmit(data);

    app.modal.close();
  }
}
