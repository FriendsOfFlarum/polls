import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Button from 'flarum/common/components/Button';
import FormGroup from 'flarum/common/components/FormGroup';
import Stream from 'flarum/common/utils/Stream';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';

dayjs.extend(utc);

export interface ISchedulePollModalAttrs extends IFormModalAttrs {
  poll: Poll;
  // Null when opened for an already-saved poll from the controls menu.
  form: { submit: (extra: object) => Promise<boolean>; state: PollFormState } | null;
  onSuccess?: (poll: Poll) => void;
}

export default class SchedulePollModal<CustomAttrs extends ISchedulePollModalAttrs = ISchedulePollModalAttrs> extends FormModal<CustomAttrs> {
  datetime!: Stream<string>;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    // The model returns UTC; datetime-local wants the local-zone equivalent.
    const scheduled = this.attrs.poll.scheduledPublishAt();

    this.datetime = Stream(scheduled ? dayjs(scheduled).local().format('YYYY-MM-DDTHH:mm') : '');
  }

  className(): string {
    return 'SchedulePollModal Modal--small';
  }

  title(): Mithril.Children {
    return app.translator.trans(
      this.attrs.poll.scheduledPublishAt() ? 'fof-polls.forum.compose.schedule_publication_edit' : 'fof-polls.forum.compose.schedule_publication'
    );
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <FormGroup
          type="datetime-local"
          name="scheduledFor"
          label={app.translator.trans('fof-polls.forum.compose.schedule_datetime_label')}
          required={true}
          stream={this.datetime}
        />
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
    this.alertAttrs = null;

    try {
      // Persist the form's edits first, so we never schedule stale data.
      if (this.attrs.form && !(await this.attrs.form.submit({ isDraft: true }))) {
        return;
      }

      const poll = this.attrs.form ? this.attrs.form.state.poll : this.attrs.poll;

      if (!poll.id()) {
        throw new Error('Cannot schedule an unsaved poll.');
      }

      await poll.publish({ scheduledFor: new Date(this.datetime()).toISOString() }, this.onerror.bind(this));

      this.hide();
      this.attrs.onSuccess?.(poll);
    } catch (error: any) {
      if (!this.alertAttrs) {
        this.alertAttrs = { type: 'error', content: error?.message ?? app.translator.trans('core.lib.error.generic_message') };
      }
    } finally {
      this.loading = false;
      m.redraw();
    }
  }
}
