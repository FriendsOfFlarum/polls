import { slug } from '../../common';
import Component from 'flarum/common/Component';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import FormError from './form/FormError';
import PollFormState from '../states/PollFormState';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.poll_form`;

export default class PollForm extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.state = new PollFormState(this.attrs.poll);

    // state handles poll initialization
    const poll = this.state.poll;

    //@todo way the options are destructured into options (answers) and optionImageUrls
    this.options = poll.options();
    this.optionAnswers = this.options.map((o) => Stream(o.answer()));
    this.optionImageUrls = this.options.map((o) => Stream(o.imageUrl()));

    this.question = Stream(poll.question());
    this.subtitle = Stream(poll.subtitle());
    this.endDate = Stream(this.formatDate(poll.endDate()));
    this.publicPoll = Stream(poll.publicPoll());
    this.allowMultipleVotes = Stream(poll.allowMultipleVotes());
    this.hideVotes = Stream(poll.hideVotes());
    this.allowChangeVote = Stream(poll.allowChangeVote());
    this.maxVotes = Stream(poll.maxVotes() || 0);

    this.datepickerMinDate = this.formatDate(undefined);

    // Replace minimum of 'today' for poll end date only if the poll is not already closed
    if (this.endDate() && dayjs(poll.endDate).isAfter(dayjs())) {
      this.datepickerMinDate = this.formatDate(poll.endDate);
    }
  }

  view() {
    return (
      <form onsubmit={this.onsubmit.bind(this)}>
        <div className="PollDiscussionModal-form">{this.fields().toArray()}</div>
      </form>
    );
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
        'subtitle',
        <div className="Form-group">
          <label className="label">{app.translator.trans('fof-polls.forum.modal.subtitle_placeholder')}</label>

          <input type="text" name="subtitle" className="FormControl" bidi={this.subtitle} />
        </div>,
        95
    );

    items.add(
      'answers',
      <div className="PollModal--answers Form-group">
        <label className="label PollModal--answers-title">
          <span>{app.translator.trans('fof-polls.forum.modal.options_label')}</span>

          {Button.component({
            className: 'Button PollModal--button Button--icon small',
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
            className: 'Button PollModal--button Button--icon',
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
      'allow-change-vote',
      <div className="Form-group">
        <Switch state={this.allowChangeVote()} onchange={this.allowChangeVote}>
          {app.translator.trans('fof-polls.forum.modal.allow_change_vote_label')}
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
        <Button type="submit" className="Button Button--primary PollModal-SubmitButton" icon="fas fa-save" loading={this.state.loading}>
          {t('fof-polls.forum.modal.submit')}
        </Button>
        {this.state.poll.exists && (
          <Button className="Button Button--secondary" icon="fas fa-trash-alt" loading={this.state.deleting} onclick={this.delete.bind(this)}>
            {t(`${prfx}.delete`)}
          </Button>
        )}
      </div>,
      -10
    );

    return items;
  }

  displayOptions() {
    return Object.keys(this.options).map((option, i) => (
      <div className="Form-group">
        <fieldset className="Poll-answer-input">
          <input
            className="FormControl"
            type="text"
            name={'answer' + (i + 1)}
            bidi={this.optionAnswers[i]}
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
              className: 'Button PollModal--button Button--icon',
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
      this.options.push(app.store.createRecord('poll_options'));
      this.optionAnswers.push(Stream(''));
      this.optionImageUrls.push(Stream(''));
    } else {
      alert(extractText(app.translator.trans('fof-polls.forum.modal.max', { max })));
    }
  }

  removeOption(i) {
    this.options.splice(i, 1);
    this.optionAnswers.splice(i, 1);
    this.optionImageUrls.splice(i, 1);
  }

  data() {
    const options = this.options.map((o, i) => {
      if (!o.data.attributes) o.data.attributes = {};

      o.data.attributes.answer = this.optionAnswers[i]();
      o.data.attributes.imageUrl = this.optionImageUrls[i]();

      return o.data;
    });

    if (this.question() === '') {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.include_question'));
    }

    if (options.length < 2) {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.min'));
    }

    return {
      question: this.question(),
      subtitle: this.subtitle(),
      endDate: this.dateToTimestamp(this.endDate()),
      publicPoll: this.publicPoll(),
      hideVotes: this.hideVotes(),
      allowChangeVote: this.allowChangeVote(),
      allowMultipleVotes: this.allowMultipleVotes(),
      maxVotes: this.maxVotes(),
      options,
    };
  }

  async onsubmit(e) {
    e.preventDefault();

    try {
      await this.state.save(this.data());

      // Show success alert
      const alertId = app.alerts.show(
        {
          type: 'success',
          controls: [
            <Button
              className="Button Button--link"
              onclick={() =>
                m.route.set(
                  app.route('compose-poll', {
                    edit: this.state.collection.id(),
                  })
                )
              }
            >
              {t(`${prfx}.continue_editing`)}
            </Button>,
          ],
        },
        t(`${prfx}.success`)
      );

      // Hide alert after 10 seconds
      setTimeout(() => app.alerts.dismiss(alertId), 10000);

      // Check if we need to call a custom onsubmit callback
      if (this.attrs.onsubmit) {
        this.attrs.onsubmit(this.state.poll);
      } else {
        // Otherwise redirect to pools list
        m.route.set(app.route('polls-manager'));
      }
    } catch (e) {
      if (e instanceof FormError) {
        app.alerts.show({ type: 'error' }, e.message);
      } else {
        // Show error alert
        app.alerts.show({ type: 'error' }, t(`${prfx}.error`));
      }
    } finally {
      this.state.loading = false;
      m.redraw();
    }
  }

  async delete() {
    if (!confirm(t(`${prfx}.delete_confirm`))) {
      return;
    }

    try {
      await this.state.delete();
      // Show success alert
      const alertId = app.alerts.show({ type: 'success' }, t(`${prfx}.delete_success`));

      // Hide alert after 10 seconds
      setTimeout(() => app.alerts.dismiss(alertId), 10000);

      // Redirect to polls list
      m.route.set(app.route('polls-manager'));
    } catch (e) {
      // Show error alert
      app.alerts.show({ type: 'error' }, t(`${prfx}.delete_error`));
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
