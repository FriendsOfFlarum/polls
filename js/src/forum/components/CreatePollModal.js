import app from 'flarum/forum/app';

import Button from 'flarum/common/components/Button';
import Modal from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';

export default class CreatePollModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.options = [Stream(''), Stream('')];
    this.optionImageUrls = [Stream(''), Stream('')];

    this.question = Stream('');

    this.endDate = Stream();

    this.publicPoll = Stream(false);
    this.hideVotes = Stream(false);
    this.allowMultipleVotes = Stream(false);
    this.maxVotes = Stream(0);

    this.datepickerMinDate = this.formatDate(undefined);

    const { poll } = this.attrs;

    // When re-opening the modal for the same discussion composer where we already set poll attributes
    if (poll && Array.isArray(poll.options)) {
      this.options = [];
      this.optionImageUrls = [];
      poll.options.forEach((option) => {
        this.options.push(Stream(option.answer));
        this.optionImageUrls.push(Stream(option.imageUrl));
      });

      this.question(poll.question);
      this.publicPoll(poll.publicPoll);
      this.hideVotes(poll.hideVotes);
      this.allowMultipleVotes(poll.allowMultipleVotes);
      this.maxVotes(poll.maxVotes || 0);

      this.endDate(this.formatDate(poll.endDate));

      // Replace minimum of 'today' for poll end date only if the poll is not already closed
      if (this.endDate() && dayjs(poll.endDate).isAfter(dayjs())) {
        this.datepickerMinDate = this.formatDate(poll.endDate);
      }
    }
  }

  title() {
    return app.translator.trans('fof-polls.forum.modal.add_title');
  }

  className() {
    return 'PollDiscussionModal Modal--medium';
  }

  content() {
    return [
      <div className="Modal-body">
        <div className="PollDiscussionModal-form">{this.fields().toArray()}</div>
      </div>,
    ];
  }

  fields() {
    const items = new ItemList();

    items.add(
      'question',
      <div className="Form-group">
        <label className="label">{app.translator.trans('fof-polls.forum.modal.question_placeholder')}</label>

        <input type="text" name="question" className="FormControl" bidi={this.question} />
      </div>,
      100
    );

    items.add(
      'answers',
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
      </div>,
      80
    );

    items.add(
      'date',
      <div className="Form-group">
        <label className="label">{app.translator.trans('fof-polls.forum.modal.date_placeholder')}</label>

        <div className="PollModal--date">
          <input
            className="FormControl"
            type="datetime-local"
            name="date"
            bidi={this.endDate}
            min={this.datepickerMinDate}
            max={this.formatDate('2038')}
          />
          {Button.component({
            className: 'Button PollModal--button',
            icon: 'fas fa-times',
            onclick: this.endDate.bind(this, null),
          })}
        </div>

        {this.endDate() && (
          <p className="helpText">
            <i class="icon fas fa-clock" />
            &nbsp;
            {dayjs(this.endDate()).isBefore(dayjs())
              ? app.translator.trans('fof-polls.forum.poll_ended')
              : app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(this.endDate()).fromNow() })}
          </p>
        )}
      </div>,
      40
    );

    items.add(
      'public',
      <div className="Form-group">
        {Switch.component(
          {
            state: this.publicPoll() || false,
            onchange: this.publicPoll,
          },
          app.translator.trans('fof-polls.forum.modal.public_poll_label')
        )}
      </div>,
      20
    );

    items.add(
      'hide-votes',
      <div className="Form-group">
        <Switch state={this.endDate() && this.hideVotes()} onchange={this.hideVotes} disabled={!this.endDate()}>
          {app.translator.trans('fof-polls.forum.modal.hide_votes_label')}
        </Switch>
      </div>,
      20
    );

    items.add(
      'allow-multiple-votes',
      <div className="Form-group">
        {Switch.component(
          {
            state: this.allowMultipleVotes() || false,
            onchange: this.allowMultipleVotes,
          },
          app.translator.trans('fof-polls.forum.modal.allow_multiple_votes_label')
        )}
      </div>,
      15
    );

    if (this.allowMultipleVotes()) {
      items.add(
        'max-votes',
        <div className="Form-group">
          <label className="label">{app.translator.trans('fof-polls.forum.modal.max_votes_label')}</label>

          <input type="number" min="0" max={this.options.length} name="maxVotes" className="FormControl" bidi={this.maxVotes} />

          <p className="helpText">{app.translator.trans('fof-polls.forum.modal.max_votes_help')}</p>
        </div>,
        15
      );
    }

    items.add(
      'submit',
      <div className="Form-group">
        {Button.component(
          {
            type: 'submit',
            className: 'Button Button--primary PollModal-SubmitButton',
            loading: this.loading,
          },
          app.translator.trans('fof-polls.forum.modal.submit')
        )}
      </div>,
      -10
    );

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
          {app.forum.attribute('allowPollOptionImage') ? (
            <input
              className="FormControl"
              type="text"
              name={'answerImage' + (i + 1)}
              bidi={this.optionImageUrls[i]}
              placeholder={app.translator.trans('fof-polls.forum.modal.image_option_placeholder') + ' #' + (i + 1)}
            />
          ) : null}
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
    const max = Math.max(app.forum.attribute('pollMaxOptions'), 2);

    if (this.options.length < max) {
      this.options.push(Stream(''));
      this.optionImageUrls.push(Stream(''));
    } else {
      alert(extractText(app.translator.trans('fof-polls.forum.modal.max', { max })));
    }
  }

  removeOption(option) {
    this.options.splice(option, 1);
    this.optionImageUrls.splice(option, 1);
  }

  data() {
    const poll = {
      question: this.question(),
      endDate: this.dateToTimestamp(this.endDate()),
      publicPoll: this.publicPoll(),
      allowMultipleVotes: this.allowMultipleVotes(),
      maxVotes: this.maxVotes(),
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

    const promise = this.attrs.onsubmit(data);

    if (promise instanceof Promise) {
      this.loading = true;

      promise.then(this.hide.bind(this), (err) => {
        console.error(err);
        this.onerror(err);
        this.loaded();
      });
    } else {
      app.modal.close();
    }
  }

  formatDate(date, def = false) {
    const dayjsDate = dayjs(date);

    if (date === false || !dayjsDate.isValid()) return def !== false ? this.formatDate(def) : null;

    return dayjsDate.format('YYYY-MM-DDTHH:mm');
  }

  dateToTimestamp(date) {
    const dayjsDate = dayjs(date);

    if (!date || !dayjsDate.isValid()) return false;

    return dayjsDate.format();
  }
}
