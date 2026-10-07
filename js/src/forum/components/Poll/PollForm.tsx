import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import FieldSet from 'flarum/common/components/FieldSet';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import Icon from 'flarum/common/components/Icon';
import Tooltip from 'flarum/common/components/Tooltip';
import ItemList from 'flarum/common/utils/ItemList';
import RequestError from 'flarum/common/utils/RequestError';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import FormError from '../form/FormError';
import PollFormState from '../../states/PollFormState';
import PollControls from '../../utils/PollControls';
import PollModel from '../../models/Poll';
import PollOption from '../../models/PollOption';
import SchedulePollModal from '../SchedulePollModal';
import UploadPollImageButton from '../UploadPollImageButton';

export interface IPollFormAttrs extends ComponentAttrs {
  poll: PollModel;
  onsubmit: (data: object, state: PollFormState) => Promise<void>;
  // Drafts only exist for global polls.
  allowDrafts?: boolean;
}

export default class PollForm extends Component<IPollFormAttrs, PollFormState> {
  protected options: PollOption[] = [];
  protected optionAnswers: Stream<string>[] = [];
  protected optionImageUrls: Stream<string>[] = [];
  protected optionKeys: number[] = [];
  protected nextOptionKey: number = 0;
  protected question!: Stream<string>;
  protected subtitle!: Stream<string>;
  protected image!: Stream<string | null>;
  protected imageAlt!: Stream<string | null>;
  protected endDate!: Stream<string | null>;
  protected publicPoll!: Stream<boolean>;
  protected allowMultipleVotes!: Stream<boolean>;
  protected hideVotes!: Stream<boolean>;
  protected allowChangeVote!: Stream<boolean>;
  protected maxVotes!: Stream<number>;
  protected datepickerMinDate: string = '';
  protected pendingAction: 'draft' | 'publish' | null = null;
  // Compared against the live form on every render to detect edits.
  protected snapshot: string = '';

  private beforeUnloadHandler = (e: BeforeUnloadEvent): void => {
    if (this.state?.dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  oninit(vnode: Mithril.Vnode<IPollFormAttrs, this>): void {
    super.oninit(vnode);

    this.state = new PollFormState(this.attrs.poll);

    const poll = this.state.poll;

    this.options = (poll.tempOptions ?? poll.options()) as PollOption[];
    this.optionAnswers = this.options.map((o) => Stream(o.answer()));
    this.optionImageUrls = this.options.map((o) => Stream(o.imageUrl()));
    this.optionKeys = this.options.map(() => this.nextOptionKey++);

    this.question = Stream(poll.question());
    this.subtitle = Stream(poll.subtitle());
    this.image = Stream(poll.image());
    this.imageAlt = Stream(poll.imageAlt());
    this.endDate = Stream(this.formatDate(poll.endDate()) || null);
    this.publicPoll = Stream(poll.publicPoll());
    this.allowMultipleVotes = Stream(poll.allowMultipleVotes());
    this.hideVotes = Stream(poll.hideVotes());
    this.allowChangeVote = Stream(poll.allowChangeVote());
    this.maxVotes = Stream(poll.maxVotes() || 0);

    this.datepickerMinDate = this.formatDate() as string;

    if (this.endDate() && dayjs(poll.endDate()).isAfter(dayjs())) {
      this.datepickerMinDate = this.formatDate(poll.endDate()) as string;
    }

    this.snapshot = this.serializeFormState();
  }

  oncreate(vnode: Mithril.VnodeDOM<IPollFormAttrs, this>): void {
    super.oncreate(vnode);

    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  onremove(vnode: Mithril.VnodeDOM<IPollFormAttrs, this>): void {
    super.onremove(vnode);

    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  view(): Mithril.Children {
    this.state.markDirty(this.serializeFormState() !== this.snapshot);

    return (
      <form className="PollForm" onsubmit={this.onsubmit.bind(this)}>
        <Form>{this.fields().toArray()}</Form>
      </form>
    );
  }

  fields(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'question',
      <FormGroup
        type="text"
        name="question"
        label={app.translator.trans('fof-polls.forum.modal.question_placeholder')}
        required={true}
        stream={this.question}
      />,
      100
    );

    items.add(
      'subtitle',
      <FormGroup type="text" name="subtitle" label={app.translator.trans('fof-polls.forum.modal.subtitle_placeholder')} stream={this.subtitle} />,
      95
    );

    items.add('poll_image', this.imageField(), 90);

    if (this.image()) {
      items.add(
        'poll_image_alt',
        <FormGroup
          type="text"
          name="imageAlt"
          label={app.translator.trans('fof-polls.forum.modal.poll_image.alt_label')}
          help={app.translator.trans('fof-polls.forum.modal.poll_image.alt_help_text')}
          required={true}
          stream={this.imageAlt}
        />,
        85
      );
    }

    items.add('answers', this.answersField(), 80);
    items.add('date', this.endDateField(), 40);
    items.add('settings', this.settingsField(), 20);
    items.add('submit-cluster', <div className="PollForm-submit">{this.submitItems().toArray()}</div>, -10);

    return items;
  }

  imageField(): Mithril.Children {
    return (
      <FieldSet
        className="FieldSet--form"
        label={extractText(app.translator.trans('fof-polls.forum.modal.poll_image.label'))}
        description={extractText(app.translator.trans('fof-polls.forum.modal.poll_image.help'))}
      >
        <input type="hidden" name="pollImage" bidi={this.image} />
        {this.deprecationNotice(!!this.image(), this.state.poll?.isImageUpload())}
        <UploadPollImageButton name="pollImage" poll={this.state.poll} onUpload={this.pollImageUploadSuccess.bind(this)} />
      </FieldSet>
    );
  }

  answersField(): Mithril.Children {
    const label = extractText(app.translator.trans('fof-polls.forum.modal.options_label'));
    const addLabel = extractText(app.translator.trans('fof-polls.forum.modal.tooltip.options.add-button'));

    return (
      <div className="PollForm-answers">
        <FieldSet className="FieldSet--form" label={label}>
          {this.answerItems().toArray()}
        </FieldSet>
        <Tooltip text={addLabel}>
          <Button className="Button Button--icon PollForm-addAnswer" icon="fas fa-plus" aria-label={addLabel} onclick={this.addOption.bind(this)} />
        </Tooltip>
      </div>
    );
  }

  answerItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const removeLabel = extractText(app.translator.trans('fof-polls.forum.modal.tooltip.options.remove-button'));

    this.options.forEach((option, i) => {
      const imageUrl = this.optionImageUrls[i];

      items.add(
        `option-${this.optionKeys[i]}`,
        // Keyed so removing a row does not shift the rows below it.
        <div className="PollForm-answer" key={this.optionKeys[i]}>
          <div className="PollForm-answerFields">
            <FormGroup
              type="text"
              name={`answer${i + 1}`}
              label={`${extractText(app.translator.trans('fof-polls.forum.modal.option_placeholder'))} ${i + 1}`}
              stream={this.optionAnswers[i]}
            />
            <FieldSet className="PollForm-answerImage" label={extractText(app.translator.trans('fof-polls.forum.modal.poll_option_image.label'))}>
              {this.deprecationNotice(!!imageUrl(), option?.isImageUpload())}
              <UploadPollImageButton name="pollOptionImage" option={option} onUpload={this.pollOptionImageUploadSuccess.bind(this, i)} />
            </FieldSet>
          </div>
          {i >= 2 && (
            <Tooltip text={removeLabel}>
              <Button
                type="button"
                className="Button Button--icon PollForm-removeAnswer"
                icon="fas fa-minus"
                aria-label={removeLabel}
                onclick={this.removeOption.bind(this, i)}
              />
            </Tooltip>
          )}
        </div>
      );
    });

    return items;
  }

  endDateField(): Mithril.Children {
    const clearLabel = extractText(app.translator.trans('fof-polls.forum.modal.date_clear'));

    return (
      <div className="PollForm-date">
        <FormGroup
          type="datetime-local"
          name="date"
          containerClassName="PollForm-dateInput"
          label={app.translator.trans('fof-polls.forum.modal.date_placeholder')}
          help={this.endDateHelp()}
          min={this.datepickerMinDate}
          max={this.formatDate('2038')}
          stream={this.endDate}
        />
        <Tooltip text={clearLabel}>
          <Button className="Button Button--icon PollForm-clearDate" icon="fas fa-times" aria-label={clearLabel} onclick={() => this.endDate(null)} />
        </Tooltip>
      </div>
    );
  }

  endDateHelp(): Mithril.Children {
    if (!this.endDate()) return null;

    return (
      <>
        <Icon name="fas fa-clock" />{' '}
        {dayjs(this.endDate()).isBefore(dayjs())
          ? app.translator.trans('fof-polls.forum.poll_ended')
          : app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(this.endDate()).fromNow() })}
      </>
    );
  }

  settingsField(): Mithril.Children {
    return (
      <FieldSet className="FieldSet--form" label={extractText(app.translator.trans('fof-polls.forum.modal.settings_label'))}>
        {this.settingItems().toArray()}
      </FieldSet>
    );
  }

  settingItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'public',
      <FormGroup
        type="switch"
        containerClassName="PollForm-setting PollForm-setting--publicPoll"
        label={app.translator.trans('fof-polls.forum.modal.public_poll_label')}
        stream={this.publicPoll}
      />,
      100
    );

    items.add(
      'hide-votes',
      <FormGroup
        type="switch"
        containerClassName="PollForm-setting PollForm-setting--hideVotes"
        label={app.translator.trans('fof-polls.forum.modal.hide_votes_label')}
        help={app.translator.trans('fof-polls.forum.modal.hide_votes_label_help')}
        disabled={!this.endDate()}
        stream={this.hideVotes}
      />,
      90
    );

    items.add(
      'allow-change-vote',
      <FormGroup
        type="switch"
        containerClassName="PollForm-setting PollForm-setting--allowChangeVote"
        label={app.translator.trans('fof-polls.forum.modal.allow_change_vote_label')}
        stream={this.allowChangeVote}
      />,
      80
    );

    items.add(
      'allow-multiple-votes',
      <FormGroup
        type="switch"
        containerClassName="PollForm-setting PollForm-setting--allowMultipleVotes"
        label={app.translator.trans('fof-polls.forum.modal.allow_multiple_votes_label')}
        stream={this.allowMultipleVotes}
      />,
      70
    );

    if (this.allowMultipleVotes()) {
      items.add(
        'max-votes',
        <FormGroup
          type="number"
          name="maxVotes"
          label={app.translator.trans('fof-polls.forum.modal.max_votes_label')}
          help={app.translator.trans('fof-polls.forum.modal.max_votes_help')}
          min="0"
          max={this.options.length}
          stream={this.maxVotes}
        />,
        60
      );
    }

    return items;
  }

  submitItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const state = this.state;
    const poll = state.poll;

    const draftsAvailable = this.attrs.allowDrafts === true && (!poll.exists || poll.isGlobal());

    if (draftsAvailable && (state.isNew() || state.isDraft())) {
      items.add('publish', this.publishSplitButton(), 30);

      items.add(
        state.isDraft() ? 'update-draft' : 'save-as-draft',
        <Button
          type="button"
          className="Button PollForm-saveDraft"
          icon="fas fa-save"
          loading={state.loading && this.pendingAction === 'draft'}
          disabled={(state.loading && this.pendingAction !== 'draft') || (state.isDraft() && !state.dirty)}
          onclick={() => this.onSaveDraft()}
        >
          {app.translator.trans(state.isDraft() ? 'fof-polls.forum.compose.update_draft' : 'fof-polls.forum.compose.save_as_draft')}
        </Button>,
        20
      );
    } else {
      items.add(
        'save',
        <Button type="submit" className="Button Button--primary PollForm-save" icon="fas fa-save" loading={state.loading} disabled={!state.dirty}>
          {app.translator.trans('fof-polls.forum.modal.submit')}
        </Button>,
        20
      );
    }

    if (poll.exists) {
      items.add(
        'delete',
        <Button
          type="button"
          className="Button Button--secondary PollForm-delete"
          icon="fas fa-trash-alt"
          loading={state.deleting}
          onclick={this.delete.bind(this)}
        >
          {app.translator.trans('fof-polls.forum.modal.delete')}
        </Button>,
        0
      );
    }

    return items;
  }

  publishSplitButton(): Mithril.Children {
    const scheduleLabel = extractText(app.translator.trans('fof-polls.forum.compose.schedule'));

    return (
      <div className="ButtonGroup PollForm-publish">
        <Button
          type="button"
          className="Button Button--primary"
          icon="fas fa-paper-plane"
          loading={this.state.loading && this.pendingAction === 'publish'}
          disabled={this.state.loading && this.pendingAction !== 'publish'}
          onclick={() => this.publish()}
        >
          {app.translator.trans('fof-polls.forum.compose.publish')}
        </Button>
        <Tooltip text={scheduleLabel}>
          <Button
            type="button"
            className="Button Button--icon Button--primary"
            icon="fas fa-clock"
            aria-label={scheduleLabel}
            onclick={() => this.schedule()}
          />
        </Tooltip>
      </div>
    );
  }

  // Validate first, so the modal never persists a draft the form rejects.
  schedule(): void {
    try {
      this.data();
    } catch (error) {
      if (error instanceof FormError) {
        app.alerts.show({ type: 'error' }, error.content);
        return;
      }

      throw error;
    }

    app.modal.show(SchedulePollModal, {
      poll: this.state.poll,
      form: this,
      onSuccess: () => m.route.set(app.route('fof.polls.list')),
    });
  }

  deprecationNotice(hasImage: boolean, isUpload: boolean): Mithril.Children {
    if (!hasImage || isUpload) return null;

    return <p className="helpText">{app.translator.trans('fof-polls.forum.modal.poll_image.url_deprecated')}</p>;
  }

  addOption(): void {
    const max = Math.max(app.forum.attribute<number>('pollMaxOptions'), 2);

    if (this.options.length >= max) {
      app.alerts.show({ type: 'error' }, app.translator.trans('fof-polls.forum.modal.max', { max }));
      return;
    }

    this.options.push(app.store.createRecord('poll_options'));
    this.optionAnswers.push(Stream(''));
    this.optionImageUrls.push(Stream(''));
    this.optionKeys.push(this.nextOptionKey++);
  }

  removeOption(i: number): void {
    this.options.splice(i, 1);
    this.optionAnswers.splice(i, 1);
    this.optionImageUrls.splice(i, 1);
    this.optionKeys.splice(i, 1);
  }

  data(): object {
    if (this.question() === '') {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.include_question'));
    }

    // Row count is not answer count: two rows are always on screen.
    const filled = this.optionAnswers.filter((s) => s()?.trim() !== '' && s() != null).length;

    if (filled < 2) {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.min'));
    }

    const empty = this.optionAnswers.length - filled;

    if (empty > 0) {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.empty_answers', { count: empty }));
    }

    const pollExists = this.state.poll.exists;

    const options = this.options.map((option, i) => {
      option.pushAttributes({ answer: this.optionAnswers[i](), imageUrl: this.optionImageUrls[i]() });

      return pollExists ? option.data : option.data.attributes;
    });

    return {
      question: this.question(),
      subtitle: this.subtitle(),
      pollImage: this.image(),
      imageAlt: this.imageAlt(),
      endDate: this.dateToTimestamp(this.endDate()) ?? false,
      publicPoll: this.publicPoll(),
      hideVotes: this.hideVotes(),
      allowChangeVote: this.allowChangeVote(),
      allowMultipleVotes: this.allowMultipleVotes(),
      maxVotes: this.maxVotes(),
      options,
    };
  }

  async onsubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.attrs.allowDrafts === true && (this.state.isNew() || this.state.isDraft())) {
      return this.onSaveDraft();
    }

    return this.onSaveChanges();
  }

  async onSaveChanges(): Promise<void> {
    if (await this.submit({})) {
      this.successAlert('fof-polls.forum.compose.success');
    }
  }

  async onSaveDraft(): Promise<void> {
    this.pendingAction = 'draft';

    const wasNew = this.state.isNew();

    try {
      if (await this.submit({ isDraft: true })) {
        this.successAlert('fof-polls.forum.compose.draft_saved');

        if (wasNew) {
          window.history.replaceState({}, '', app.route('fof.polls.composer', { id: this.state.poll.id() }));
        }
      }
    } finally {
      this.pendingAction = null;
      m.redraw();
    }
  }

  async publish(): Promise<void> {
    this.pendingAction = 'publish';

    try {
      // /publish only accepts drafts, so a new poll is saved as one first.
      if (!(await this.submit({ isDraft: true }))) return;

      if (!this.state.poll.id()) {
        throw new Error('Cannot publish an unsaved poll.');
      }

      await this.state.poll.publish();
      this.successAlert('fof-polls.forum.poll_controls.publish_success');
      m.route.set(app.route('fof.polls.list'));
    } catch (error) {
      this.handleError(error);
    } finally {
      this.pendingAction = null;
      m.redraw();
    }
  }

  async submit(extra: object): Promise<boolean> {
    try {
      await this.attrs.onsubmit({ ...this.data(), ...extra }, this.state);

      this.snapshot = this.serializeFormState();
      this.state.markDirty(false);

      return true;
    } catch (error) {
      this.handleError(error);

      return false;
    }
  }

  async delete(): Promise<void> {
    this.state.loading = true;

    try {
      await PollControls.deleteAction(this.state.poll);
      this.state.deleting = true;
    } finally {
      this.state.loading = false;
      m.redraw();
    }
  }

  protected handleError(error: unknown): void {
    if (error instanceof FormError) {
      app.alerts.show({ type: 'error' }, error.content);
      return;
    }

    // Core's request handler has already shown the server's own message.
    if (error instanceof RequestError) return;

    console.error(error);
    app.alerts.show({ type: 'error' }, app.translator.trans('fof-polls.forum.modal.error'));
  }

  protected successAlert(key: string): void {
    const id = app.alerts.show({ type: 'success' }, app.translator.trans(key));

    setTimeout(() => app.alerts.dismiss(id), 10000);
  }

  protected serializeFormState(): string {
    return JSON.stringify({
      question: this.question(),
      subtitle: this.subtitle(),
      image: this.image(),
      imageAlt: this.imageAlt(),
      endDate: this.endDate(),
      publicPoll: this.publicPoll(),
      allowMultipleVotes: this.allowMultipleVotes(),
      hideVotes: this.hideVotes(),
      allowChangeVote: this.allowChangeVote(),
      maxVotes: this.maxVotes(),
      answers: this.optionAnswers.map((s) => s()),
      images: this.optionImageUrls.map((s) => s()),
    });
  }

  // No argument means now; an absent date means there is nothing to format.
  formatDate(date: Date | string | false | undefined | null = undefined, def: Date | false = false): string | false {
    if (date === false || date === null) return def !== false ? this.formatDate(def) : false;

    const parsed = dayjs(date);

    if (!parsed.isValid()) return def !== false ? this.formatDate(def) : false;

    return parsed.format('YYYY-MM-DDTHH:mm');
  }

  dateToTimestamp(date: string | null): string | null {
    const parsed = dayjs(date || undefined);

    if (!date || !parsed.isValid()) return null;

    return parsed.format();
  }

  pollImageUploadSuccess(fileName: string | null | undefined): void {
    this.image(fileName ?? null);
    this.state.poll?.pushAttributes({ isImageUpload: !!fileName });
  }

  pollOptionImageUploadSuccess(index: number, fileName: string | null | undefined): void {
    this.optionImageUrls[index] = Stream(fileName ?? '');
    this.options[index]?.pushAttributes({ isImageUpload: !!fileName });
  }
}
