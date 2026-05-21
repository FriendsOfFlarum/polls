import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import FormError from '../form/FormError';
import PollFormState from '../../states/PollFormState';
import PollControls from '../../utils/PollControls';
import PollModel from '../../models/Poll';
import PollOption from '../../models/PollOption';
import UploadPollImageButton from '../UploadPollImageButton';
import Poll from '../../models/Poll';
import Tooltip from 'flarum/common/components/Tooltip';
import SchedulePollModal from '../SchedulePollModal';

interface PollFormAttrs extends ComponentAttrs {
  poll: PollModel;
  onsubmit: (data: object, state: PollFormState) => Promise<void>;
  /**
   * Whether the draft / publish / schedule controls should be offered.
   * Drafts are only supported for global polls, so post-bound and
   * poll-group flows must leave this off (default). The compose page
   * opts in explicitly.
   */
  allowDrafts?: boolean;
}

export default class PollForm extends Component<PollFormAttrs, PollFormState> {
  protected options: PollOption[] = [];
  protected optionAnswers: Stream<string>[] = [];
  protected optionImageUrls: Stream<string>[] = [];
  protected question: Stream<string>;
  protected subtitle: Stream<string>;
  protected image: Stream<string | null>;
  protected imageAlt: Stream<string | null>;
  protected endDate: Stream<string | null>;
  protected publicPoll: Stream<boolean>;
  protected allowMultipleVotes: Stream<boolean>;
  protected hideVotes: Stream<boolean>;
  protected allowChangeVote: Stream<boolean>;
  protected maxVotes: Stream<number>;
  protected datepickerMinDate: string = '';
  protected pendingAction: 'draft' | 'publish' | null = null;
  // Snapshot of the form payload at load (and after each successful save).
  // `state.dirty` is recomputed on every render by comparing this against
  // the live serialized form — avoids hooking every `bidi` input.
  protected snapshot: string = '';

  // Browser-level guard: prompts on tab close / refresh / typed-URL when
  // the form is dirty.
  private beforeUnloadHandler = (e: BeforeUnloadEvent): void => {
    if (this.state?.dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  oninit(vnode: Mithril.Vnode): void {
    super.oninit(vnode);
    this.state = new PollFormState(this.attrs.poll);

    // state handles poll initialization
    const poll = this.state.poll;

    this.options = (poll.tempOptions ?? poll.options()) as PollOption[];
    this.optionAnswers = this.options.map((o) => Stream(o.answer()));
    this.optionImageUrls = this.options.map((o) => Stream(o.imageUrl()));

    this.question = Stream(poll.question());
    this.subtitle = Stream(poll.subtitle());
    this.image = Stream(poll.image());
    this.imageAlt = Stream(poll.imageAlt());
    this.endDate = Stream(this.formatDate(poll.endDate()));
    this.publicPoll = Stream(poll.publicPoll());
    this.allowMultipleVotes = Stream(poll.allowMultipleVotes());
    this.hideVotes = Stream(poll.hideVotes());
    this.allowChangeVote = Stream(poll.allowChangeVote());
    this.maxVotes = Stream(poll.maxVotes() || 0);

    // Set minimum date for datepicker to current date
    this.datepickerMinDate = this.formatDate() as string;

    // Replace minimum of 'today' for poll end date only if the poll is not already closed
    if (this.endDate() && dayjs(poll.endDate()).isAfter(dayjs())) {
      // We know that endDate is set, so we can safely cast the result to string
      this.datepickerMinDate = this.formatDate(poll.endDate()) as string;
    }

    this.snapshot = this.serializeFormState();
  }

  oncreate(vnode: Mithril.VnodeDOM): void {
    super.oncreate(vnode);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  onremove(vnode: Mithril.VnodeDOM): void {
    super.onremove(vnode);
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  /**
   * Stable JSON of every user-editable field, used to detect dirty state by
   * comparison against `this.snapshot`. Order matters — keep it stable.
   */
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

  protected refreshDirty(): void {
    this.state.markDirty(this.serializeFormState() !== this.snapshot);
  }

  view(): Mithril.Children {
    // Recompute dirty before each render so disabled state stays accurate
    // without wrapping every `bidi` input in an oninput hook.
    this.refreshDirty();

    return (
      <form onsubmit={this.onsubmit.bind(this)}>
        <div className="PollDiscussionModal-form">{this.fields().toArray()}</div>
      </form>
    );
  }

  fields(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'question',
      <div className="Form-group Form-group--input">
        <label className="label">{app.translator.trans('fof-polls.forum.modal.question_placeholder')}</label>

        <input type="text" name="question" className="FormControl" bidi={this.question} />
      </div>,
      100
    );

    items.add(
      'subtitle',
      <div className="Form-group Form-group--input">
        <label className="label">{app.translator.trans('fof-polls.forum.modal.subtitle_placeholder')}</label>

        <input type="text" name="subtitle" className="FormControl" bidi={this.subtitle} />
      </div>,
      95
    );

    const hasImage = this.image();

    items.add(
      'poll_image',
      <div className="Form-group Form-group--upload">
        <label className="label">{app.translator.trans('fof-polls.forum.modal.poll_image.label')}</label>
        {this.uploadConditional(
          hasImage,
          this.state.poll?.isImageUpload(),
          <>
            <p className="helpText">{app.translator.trans('fof-polls.forum.modal.poll_image.help')}</p>
            <input type="hidden" name="pollImage" bidi={this.image} />
          </>,
          <UploadPollImageButton name="pollImage" poll={this.state.poll} onUpload={this.pollImageUploadSuccess.bind(this)} />
        )}
      </div>,
      90
    );

    if (hasImage) {
      items.add(
        'poll_image_alt',
        <div className="Form-group Form-group--input">
          <label className="label">{app.translator.trans('fof-polls.forum.modal.poll_image.alt_label')}</label>

          <input type="text" required name="imageAlt" className="FormControl" bidi={this.imageAlt} />

          <p className="helpText">{app.translator.trans('fof-polls.forum.modal.poll_image.alt_help_text')}</p>
        </div>,
        90
      );
    }

    items.add(
      'answers',
      <div className="PollModal--answers Form-group Form-group--input">
        {this.displayOptions().toArray()}

        <Tooltip text={app.translator.trans('fof-polls.forum.modal.tooltip.options.add-button')}>
          <Button
            className="Button PollModal--button Button--icon PollModal--add-button"
            icon="fas fa-plus"
            onclick={this.addOption.bind(this)}
            aria-label={extractText(app.translator.trans('fof-polls.forum.modal.tooltip.options.add-button'))}
          />
        </Tooltip>
      </div>,
      80
    );

    items.add(
      'date',
      <div className="Form-group Form-group--input">
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
            'aria-label': extractText(app.translator.trans('fof-polls.forum.modal.date_clear')),
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
      <div className="Form-group Form-group--switch">
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
      <div className="Form-group Form-group--switch">
        <Switch state={this.endDate() && this.hideVotes()} onchange={this.hideVotes} disabled={!this.endDate()}>
          {app.translator.trans('fof-polls.forum.modal.hide_votes_label')}
        </Switch>
        <p className="helpText">{app.translator.trans('fof-polls.forum.modal.hide_votes_label_help')}</p>
      </div>,
      20
    );

    items.add(
      'allow-change-vote',
      <div className="Form-group Form-group--switch">
        <Switch state={this.allowChangeVote()} onchange={this.allowChangeVote}>
          {app.translator.trans('fof-polls.forum.modal.allow_change_vote_label')}
        </Switch>
      </div>,
      20
    );

    items.add(
      'allow-multiple-votes',
      <div className="Form-group Form-group--switch">
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
      'submit-cluster',
      <div className="PollModal--submitCluster PollForm-group">
        {this.submitItems().toArray()}
        {this.state.poll.exists && (
          <Button
            className="Button Button--secondary PollModal-DeleteButton"
            icon="fas fa-trash-alt"
            loading={this.state.deleting}
            onclick={this.delete.bind(this)}
          >
            {app.translator.trans('fof-polls.forum.modal.delete')}
          </Button>
        )}
      </div>,
      -10
    );

    return items;
  }

  submitItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.state.poll;
    const state = this.state;

    // Drafts are global-only. For existing polls we can trust `isGlobal()`;
    // for new polls the caller's `allowDrafts` flag is the source of truth
    // since the poll hasn't been attached to anything yet.
    const draftsAvailable = this.attrs.allowDrafts === true && (!poll.exists || poll.isGlobal());
    const isNew = state.isNew();
    const isDraft = state.isDraft();
    const dirty = state.dirty;

    if (draftsAvailable && (isNew || isDraft)) {
      // Publish first so the primary action sits leftmost in the cluster.
      items.add('publish', this.publishSplitButton(), 30);

      // Distinct keys preserve the public ItemList API: third-party
      // extensions can target either button by its original key.
      items.add(
        isDraft ? 'update-draft' : 'save-as-draft',
        <Button
          type="button"
          className="Button PollModal-SaveDraftButton"
          icon="fas fa-save"
          loading={state.loading && this.pendingAction === 'draft'}
          disabled={(state.loading && this.pendingAction !== 'draft') || (isDraft && !dirty)}
          onclick={() => this.onSaveDraft()}
        >
          {app.translator.trans(isDraft ? 'fof-polls.forum.compose.update_draft' : 'fof-polls.forum.compose.save_as_draft')}
        </Button>,
        20
      );
    } else {
      items.add(
        'save',
        <Button
          type="button"
          className="Button Button--primary PollModal-SubmitButton"
          icon="fas fa-save"
          loading={state.loading}
          disabled={!dirty}
          onclick={() => this.onSaveChanges()}
        >
          {app.translator.trans('fof-polls.forum.modal.submit')}
        </Button>,
        20
      );
    }

    return items;
  }

  publishSplitButton(): Mithril.Children {
    return (
      <div className="ButtonGroup PollForm-publishCluster">
        <Button
          className="Button Button--primary PollModal-PublishButton"
          icon="fas fa-paper-plane"
          loading={this.state.loading && this.pendingAction === 'publish'}
          disabled={this.state.loading && this.pendingAction !== 'publish'}
          onclick={() => this.publish()}
        >
          {app.translator.trans('fof-polls.forum.compose.publish')}
        </Button>
        <Button
          className="Button Button--icon Button--primary PollModal-ScheduleButton"
          icon="fas fa-clock"
          onclick={() => {
            // Pre-validate so we never open the schedule modal over an
            // invalid form. Without this, the modal would persist a draft
            // (failing silently), then schedule against stale DB state.
            try {
              this.data();
            } catch (error) {
              if (error instanceof FormError) {
                app.alerts.show({ type: 'error' }, error.message);
                return;
              }
              throw error;
            }
            app.modal.show(SchedulePollModal, {
              poll: this.state.poll,
              form: this,
              onSuccess: () => m.route.set(app.route('fof.polls.list')),
            });
          }}
          title={extractText(app.translator.trans('fof-polls.forum.compose.schedule'))}
        />
      </div>
    );
  }

  displayOptions(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const canUpload = app.forum.attribute<boolean>('canUploadPollImages');

    this.options.forEach((option, i) => {
      const imgFunc = this.optionImageUrls[i];

      items.add(
        'option-' + i,
        <div className="Form-group Form-group--answer">
          <fieldset className="Poll-answer-input">
            <label className="FieldSet-label PollModal--answers-title">
              {app.translator.trans('fof-polls.forum.modal.options_label') + ' ' + (i + 1)}
            </label>
            <input className="FormControl" type="text" name={'answer' + (i + 1)} bidi={this.optionAnswers[i]} />
            <div className="Poll-answer-image">
              {this.uploadConditional(
                !!imgFunc(),
                option?.isImageUpload(),
                <div className="Poll-answer-imageInfo">
                  <label className="label">{app.translator.trans('fof-polls.forum.modal.poll_option_image.label')}</label>
                  <p className="helpText">{app.translator.trans('fof-polls.forum.modal.poll_option_image.help')}</p>
                  <input type="hidden" name={'answerImage' + (i + 1)} value={imgFunc()} />
                </div>,

                <UploadPollImageButton name="pollOptionImage" option={option} onUpload={this.pollOptionImageUploadSuccess.bind(this, i)} />
              )}
            </div>
          </fieldset>
          {i >= 2
            ? Button.component({
                type: 'button',
                className: 'Button PollModal--button Button--icon',
                icon: 'fas fa-minus',
                'aria-label': extractText(app.translator.trans('fof-polls.forum.modal.tooltip.options.remove-button')),
                onclick: i >= 2 ? this.removeOption.bind(this, i) : '',
              })
            : ''}
        </div>
      );
    });

    return items;
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

  removeOption(i: number): void {
    this.options.splice(i, 1);
    this.optionAnswers.splice(i, 1);
    this.optionImageUrls.splice(i, 1);
  }

  data(): object {
    if (this.question() === '') {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.include_question'));
    }

    // Count options with a non-empty answer. Checking `this.options.length`
    // would be misleading — the UI keeps at least two rows on screen at all
    // times (removeOption only allows `i >= 2`), so a row count of 2 doesn't
    // imply two answers have been typed.
    const filledCount = this.optionAnswers.filter((s) => {
      const v = s();
      return v != null && v.trim() !== '';
    }).length;

    if (filledCount < 2) {
      throw new FormError(app.translator.trans('fof-polls.forum.modal.min'));
    }

    // Above 2 filled, any remaining blank rows are still a problem — they'd
    // trip the server's per-row `answer: required` rule. Tell the user how
    // many empties there are so they can fill or remove them.
    const emptyCount = this.optionAnswers.length - filledCount;
    if (emptyCount > 0) {
      // extractText flattens the translator's rich-array output — FormError
      // stringifies via `+ ''`, which would otherwise join array chunks with
      // commas (e.g. "1, answer is empty…").
      throw new FormError(extractText(app.translator.trans('fof-polls.forum.modal.empty_answers', { count: emptyCount })));
    }

    const pollExists = this.state.poll.exists;
    const options = this.options.map((option, i) => {
      option.pushAttributes({
        answer: this.optionAnswers[i](),
        imageUrl: this.optionImageUrls[i](),
      });

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

  async onsubmit(event: Event) {
    event.preventDefault();
    // Buttons are all type="button"; this only fires on Enter inside an
    // input. Route to the action that matches the cluster's current shape.
    if (this.attrs.allowDrafts === true && (this.state.isNew() || this.state.isDraft())) {
      return this.onSaveDraft();
    }
    return this.onSaveChanges();
  }

  async onSaveChanges(): Promise<void> {
    if (await this.submit({})) {
      const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.compose.success'));
      setTimeout(() => app.alerts.dismiss(alertId), 10000);
    }
  }

  async onSaveDraft(): Promise<void> {
    this.pendingAction = 'draft';
    const wasNew = this.state.isNew();
    try {
      if (await this.submit({ isDraft: true })) {
        const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.compose.draft_saved'));
        setTimeout(() => app.alerts.dismiss(alertId), 10000);
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
      // New polls only: create as a draft first so /publish below succeeds.
      // Submitting without isDraft would publish immediately, and the
      // follow-up /publish call would 403 — the policy only permits
      // publishing drafts.
      if (!(await this.submit({ isDraft: true }))) return;
      // Defensive: submit() hands off to attrs.onsubmit, which must
      // assign the saved Poll to state.poll so id() is populated for
      // /publish. Fail loudly here if a future onsubmit forgets that
      // — better than POSTing to /polls/undefined/publish.
      if (!this.state.poll.id()) {
        throw new Error('Cannot publish an unsaved poll.');
      }

      await this.state.poll.publish();
      const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.poll_controls.publish_success'));
      setTimeout(() => app.alerts.dismiss(alertId), 10000);
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
      // Successful save: re-baseline so the form is no longer dirty
      // until the user edits again.
      this.snapshot = this.serializeFormState();
      this.state.markDirty(false);
      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  protected handleError(error: unknown): void {
    if (error instanceof FormError) {
      app.alerts.show({ type: 'error' }, error.message);
      return;
    }
    console.error(error);
    app.alerts.show({ type: 'error' }, app.translator.trans('fof-polls.forum.modal.error'));
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

  formatDate(date: Date | string | false | undefined | null = undefined, def: Date | false = false): string | false {
    const dayjsDate = dayjs(date);

    if (date === false || !dayjsDate.isValid()) return def !== false ? this.formatDate(def) : false;

    return dayjsDate.format('YYYY-MM-DDTHH:mm');
  }

  dateToTimestamp(date: Date | false): string | null {
    const dayjsDate = dayjs(date);

    if (!date || !dayjsDate.isValid()) return null;

    return dayjsDate.format();
  }

  pollImageUploadSuccess(fileName: string | null | undefined): void {
    this.image(fileName);
    this.state.poll?.pushAttributes({ isImageUpload: !!fileName });
  }

  pollOptionImageUploadSuccess(index: number, fileName: string | null | undefined): void {
    this.optionImageUrls[index] = Stream(fileName);
    this.options[index]?.pushAttributes({ isImageUpload: !!fileName });
  }

  uploadConditional(hasImage: boolean, isUpload: boolean, ifCanUpload: JSX.Element, uploadButton: JSX.Element) {
    const isExistingUrlImage = hasImage && !isUpload;

    // Existing poll with an external URL image — show deprecation notice
    if (isExistingUrlImage) {
      return (
        <>
          {ifCanUpload}
          <p className="helpText">{app.translator.trans('fof-polls.forum.modal.poll_image.url_deprecated')}</p>
          {uploadButton}
        </>
      );
    }

    return (
      <>
        {ifCanUpload}
        {uploadButton}
      </>
    );
  }
}
