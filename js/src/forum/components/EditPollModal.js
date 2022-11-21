import app from 'flarum/forum/app';

import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import CreatePollModal from './CreatePollModal';

export default class EditPollModal extends CreatePollModal {
  oninit(vnode) {
    super.oninit(vnode);

    this.poll = this.attrs.poll;

    this.options = this.poll.options();
    this.optionAnswers = this.options.map((o) => Stream(o.answer()));
    this.optionImageUrls = this.options.map((o) => Stream(o.imageUrl()));
    this.question = Stream(this.poll.question());
    this.endDate = Stream(this.poll.endDate());
    this.publicPoll = Stream(this.poll.publicPoll());
  }

  title() {
    return app.translator.trans('fof-polls.forum.modal.edit_title');
  }

  displayOptions() {
    return this.options.map((opt, i) => (
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
              className: 'Button PollModal--button',
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
      this.options.push(app.store.createRecord('poll_options'));
      this.optionAnswers.push(Stream(''));
      this.optionImageUrls.push(Stream(''));
    } else {
      alert(app.translator.trans('fof-polls.forum.modal.max'));
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

    return {
      question: this.question(),
      endDate: this.endDate() || false,
      publicPoll: this.publicPoll(),
      options,
    };
  }

  onsubmit(e) {
    e.preventDefault();

    if (this.loading) return;

    this.loading = true;

    return this.poll
      .save(this.data())
      .then(() => {
        document.location.reload();
      })
      .catch((e) => {
        this.loaded();
        this.onerror(e);
      });
  }
}
