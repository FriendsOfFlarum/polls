import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
import type Mithril from 'mithril';

interface SchedulePollModalAttrs extends IInternalModalAttrs {
  poll: Poll;
  /**
   * Parent PollForm to persist-before-schedule. Pass `null` when opening
   * the modal for an already-saved poll (e.g. from the controls menu),
   * in which case we skip straight to scheduling.
   */
  form: { submit: (extra: object) => Promise<boolean>; state: PollFormState } | null;
}

export default class SchedulePollModal extends Modal<SchedulePollModalAttrs> {
  datetime: Stream<string> = Stream('');
  error: string | null = null;

  className() {
    return 'SchedulePollModal Modal--small';
  }

  title(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.compose.schedule_publication');
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>{app.translator.trans('fof-polls.forum.compose.schedule_datetime_label')}</label>
            <input
              type="datetime-local"
              className="FormControl"
              value={this.datetime()}
              oninput={(e: InputEvent) => this.datetime((e.target as HTMLInputElement).value)}
            />
          </div>
          {this.error && <div className="Form-group helpText text-error">{this.error}</div>}
          <div className="Form-group">
            <Button className="Button Button--primary" loading={this.loading} onclick={() => this.submit()}>
              {app.translator.trans('fof-polls.forum.compose.schedule_submit')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  async submit() {
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

      // Then schedule.
      await poll.publish({ scheduledFor: new Date(this.datetime()).toISOString() });
      this.hide();
      m.route.set(app.route('fof.polls.list'));
    } catch (e: any) {
      this.error = e?.response?.errors?.[0]?.detail ?? e.message ?? 'Unknown error';
    } finally {
      this.loading = false;
      m.redraw();
    }
  }
}
