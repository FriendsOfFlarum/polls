import app from 'flarum/forum/app';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
import type Mithril from 'mithril';

dayjs.extend(utc);

interface SchedulePollModalAttrs extends IFormModalAttrs {
  poll: Poll;
  /**
   * Parent PollForm to persist-before-schedule. Pass `null` when opening
   * the modal for an already-saved poll (e.g. from the controls menu),
   * in which case we skip straight to scheduling.
   */
  form: { submit: (extra: object) => Promise<boolean>; state: PollFormState } | null;
  onSuccess?: (poll: Poll) => void;
}

export default class SchedulePollModal extends FormModal<SchedulePollModalAttrs> {
  datetime!: Stream<string>;
  error: string | null = null;

  oninit(vnode: Mithril.Vnode<SchedulePollModalAttrs, this>) {
    super.oninit(vnode);

    // Prefill the picker when reopening for an already-scheduled draft.
    // The model returns UTC; <input type="datetime-local"> wants the
    // local-zone equivalent in YYYY-MM-DDTHH:mm format.
    const scheduled = this.attrs.poll.scheduledPublishAt();
    this.datetime = Stream(scheduled ? dayjs(scheduled).local().format('YYYY-MM-DDTHH:mm') : '');
  }

  className() {
    return 'SchedulePollModal Modal--small';
  }

  title(): Mithril.Children {
    const isEditing = !!this.attrs.poll.scheduledPublishAt();

    return app.translator.trans(isEditing ? 'fof-polls.forum.compose.schedule_publication_edit' : 'fof-polls.forum.compose.schedule_publication');
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <div className="Form-group">
          <label>{app.translator.trans('fof-polls.forum.compose.schedule_datetime_label')}</label>
          <input type="datetime-local" className="FormControl" bidi={this.datetime} />
        </div>
        {this.error && <div className="Form-group helpText text-error">{this.error}</div>}
        <div className="Form-group">
          <Button type="submit" className="Button Button--primary" loading={this.loading}>
            {app.translator.trans('fof-polls.forum.compose.schedule_submit')}
          </Button>
        </div>
      </div>
    );
  }

  async onsubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    this.loading = true;
    this.error = null;

    try {
      // When invoked from a compose form, persist the user's current edits
      // as a draft first. If validation fails, PollForm.submit shows an
      // alert and returns false — we must NOT fall through to publish,
      // otherwise we'd schedule against stale DB state while the on-screen
      // form is invalid. When invoked from the controls menu there's no
      // form (poll already persisted), so we skip straight to scheduling.
      if (this.attrs.form) {
        const ok = await this.attrs.form.submit({ isDraft: true });
        if (!ok) {
          return;
        }
      }

      const poll = this.attrs.form ? this.attrs.form.state.poll : this.attrs.poll;

      if (!poll.id()) {
        throw new Error('Cannot schedule an unsaved poll.');
      }

      await poll.publish({ scheduledFor: new Date(this.datetime()).toISOString() });
      this.hide();
      this.attrs.onSuccess?.(poll);
    } catch (e: any) {
      this.error = e?.response?.errors?.[0]?.detail ?? e.message ?? 'Unknown error';
    } finally {
      this.loading = false;
      m.redraw();
    }
  }
}
