import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import Poll from '../models/Poll';
import type Mithril from 'mithril';

interface SchedulePollModalAttrs extends IInternalModalAttrs {
  poll: Poll;
  form: any;
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
      // First ensure the poll is persisted (draft).
      await this.attrs.form.submit({ isDraft: true });
      // Then schedule.
      await this.attrs.poll.publish({ scheduledFor: new Date(this.datetime()).toISOString() });
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
