import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Separator from 'flarum/common/components/Separator';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import Poll from '../models/Poll';
import ComposePollPage from '../components/ComposePollPage';
import PollsPage from '../components/PollsPage';
import PollViewPage from '../components/PollViewPage';
import PollListState from '../states/PollListState';
import SchedulePollModal from '../components/SchedulePollModal';

type Context = Component<any, any>;

export default {
  controls(poll: Poll, context: Context): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const sections = ['poll', 'moderation', 'destructive'] as const;

    sections.forEach((section) => {
      const controls = (this[`${section}Controls`](poll, context) as ItemList<Mithril.Children>).toArray();

      if (!controls.length) return;

      controls.forEach((item: any) => items.add(item.itemName, item));
      items.add(`${section}Separator`, <Separator />);
    });

    return items;
  },

  pollControls(poll: Poll, context: Context): ItemList<Mithril.Children> {
    return new ItemList<Mithril.Children>();
  },

  moderationControls(poll: Poll, context: Context): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (poll.canEdit()) {
      items.add(
        'edit',
        <Button icon="fas fa-pencil-alt" onclick={this.editAction.bind(this, poll)}>
          {app.translator.trans('fof-polls.forum.poll_controls.edit_label')}
        </Button>
      );
    }

    if (poll.canPublish() && poll.isDraft()) {
      items.add(
        'publish',
        <Button icon="fas fa-paper-plane" onclick={() => this.publishAction(poll)}>
          {app.translator.trans('fof-polls.forum.poll_controls.publish_label')}
        </Button>
      );

      items.add(
        'schedulePublish',
        <Button icon="fas fa-clock" onclick={() => this.scheduleAction(poll)}>
          {app.translator.trans(
            poll.isScheduled() ? 'fof-polls.forum.poll_controls.edit_schedule_publish_label' : 'fof-polls.forum.poll_controls.schedule_publish_label'
          )}
        </Button>
      );

      if (poll.isScheduled()) {
        items.add(
          'cancelSchedule',
          <Button icon="fas fa-times" onclick={() => this.cancelScheduleAction(poll)}>
            {app.translator.trans('fof-polls.forum.poll_controls.cancel_schedule_label')}
          </Button>
        );
      }
    }

    return items;
  },

  destructiveControls(poll: Poll, context: Context): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (poll.canUnpublish()) {
      items.add(
        'unpublish',
        <Button icon="fas fa-undo" onclick={() => this.unpublishAction(poll)}>
          {app.translator.trans('fof-polls.forum.poll_controls.unpublish_label')}
        </Button>
      );
    }

    if (poll.canDelete()) {
      items.add(
        'delete',
        <Button icon="far fa-trash-alt" onclick={this.deleteAction.bind(this, poll)}>
          {app.translator.trans('fof-polls.forum.poll_controls.delete_label')}
        </Button>
      );
    }

    return items;
  },

  editAction(poll: Poll): void {
    m.route.set(app.route('fof.polls.composer', { id: poll.id() }));
  },

  scheduleAction(poll: Poll): void {
    app.modal.show(SchedulePollModal, {
      poll,
      form: null,
      onSuccess: app.current.matches(PollsPage) ? () => m.redraw() : () => m.route.set(app.route('fof.polls.view', { id: poll.id() })),
    });
  },

  async deleteAction(poll: Poll): Promise<void> {
    if (!confirm(extractText(app.translator.trans('fof-polls.forum.poll_controls.delete_confirmation')))) {
      return;
    }

    return poll
      .delete()
      .then(() => {
        this.alert('success', 'fof-polls.forum.poll_controls.delete_success_message');

        if (app.current.matches(ComposePollPage) || app.current.matches(PollViewPage)) {
          m.route.set(app.route('fof.polls.list'));
        } else {
          PollListState.notifyDeleted(poll);
        }
      })
      .catch(() => this.alert('error', 'fof-polls.forum.poll_controls.delete_error_message'));
  },

  async publishAction(poll: Poll): Promise<void> {
    try {
      await poll.publish({}, (error: any) => this.errorAlert(error));
      this.alert('success', 'fof-polls.forum.poll_controls.publish_success');
      m.redraw();
    } catch {
      // errorAlert already reported it.
    }
  },

  async cancelScheduleAction(poll: Poll): Promise<void> {
    try {
      await poll.publish({ scheduledFor: null }, (error: any) => this.errorAlert(error));
      this.alert('success', 'fof-polls.forum.poll_controls.cancel_schedule_success');
      m.redraw();
    } catch {
      // errorAlert already reported it.
    }
  },

  async unpublishAction(poll: Poll): Promise<void> {
    if (!confirm(extractText(app.translator.trans('fof-polls.forum.poll_controls.unpublish_confirmation')))) return;

    try {
      await poll.unpublish(() => app.alerts.show({ type: 'error' }, app.translator.trans('fof-polls.forum.poll_controls.unpublish_error_has_votes')));
      this.alert('success', 'fof-polls.forum.poll_controls.unpublish_success');
      m.redraw();
    } catch {
      // The error handler above already reported it.
    }
  },

  alert(type: 'success' | 'error', key: string): void {
    const id = app.alerts.show({ type }, app.translator.trans(key));

    if (type === 'success') setTimeout(() => app.alerts.dismiss(id), 10000);
  },

  errorAlert(error: any): void {
    const detail = error?.response?.errors?.[0]?.detail;

    app.alerts.show({ type: 'error' }, detail ?? app.translator.trans('fof-polls.forum.poll_form.error'));
  },
};
