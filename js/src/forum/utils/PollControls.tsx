import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import Component from 'flarum/common/Component';
import ComposePollPage from '../components/ComposePollPage';
import PollsPage from '../components/PollsPage';
import ItemList from 'flarum/common/utils/ItemList';
import Separator from 'flarum/common/components/Separator';
import Button from 'flarum/common/components/Button';
import SchedulePollModal from '../components/SchedulePollModal';

/**
 * The `UserControls` utility constructs a list of buttons for a user which
 * perform actions on it.
 */
export default {
  /**
   * Get a list of controls for a user.
   */
  controls(poll: Poll, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    const sections: ('poll' | 'moderation' | 'destructive')[] = ['poll', 'moderation', 'destructive'];
    sections.forEach((section) => {
      const controls = (this[`${section}Controls`](poll, context) as ItemList<Mithril.Children>).toArray();
      if (controls.length) {
        controls.forEach((item) => items.add(item.itemName, item));
        items.add(section + 'Separator', <Separator />);
      }
    });

    return items;
  },

  /**
   * Get controls for direct modifcation actions on polls (e.g. vote, view voters).
   */
  pollControls(poll: Poll, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    return items;
  },

  /**
   * Get controls for a user pertaining to moderation (e.g. suspend, edit).
   */
  moderationControls(poll: Poll, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (poll.canEdit()) {
      items.add(
        'edit',
        <Button icon="fas fa-pencil-alt" onclick={this.editAction.bind(this, poll)}>
          {app.translator.trans(`fof-polls.forum.poll_controls.edit_label`)}
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
        <Button icon="fas fa-clock" onclick={() => app.modal.show(SchedulePollModal, { poll, form: null })}>
          {app.translator.trans('fof-polls.forum.poll_controls.schedule_publish_label')}
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

  /**
   * Get controls for a user which are destructive (e.g. delete).
   * @protected
   */
  destructiveControls(poll: Poll, context: Component): ItemList<Mithril.Children> {
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
          {app.translator.trans(`fof-polls.forum.poll_controls.delete_label`)}
        </Button>
      );
    }

    return items;
  },

  /**
   * Delete the poll.
   */
  async deleteAction(poll: Poll): Promise<void> {
    if (!confirm(app.translator.trans(`fof-polls.forum.poll_controls.delete_confirmation`) as string)) {
      return;
    }

    return poll
      .delete()
      .then(() => {
        this.showDeletionAlert(poll, 'success');
        if (app.current.matches(ComposePollPage, { id: poll.id() }) || app.current.matches(PollsPage, { id: poll.id() })) {
          app.history.back();
        } else {
          window.location.reload();
        }
      })
      .catch(() => this.showDeletionAlert(poll, 'error'));
  },

  /**
   * Show deletion alert of poll
   */
  showDeletionAlert(poll: Poll, type: string): void {
    const message = {
      success: `fof-polls.forum.poll_controls.delete_success_message`,
      error: `fof-polls.forum.poll_controls.delete_error_message`,
    }[type]!;

    const content = app.translator.trans(message, { poll: poll });
    const alertId = app.alerts.show({ type }, content);
    // Errors stay sticky so the user can read them; successes auto-dismiss.
    if (type === 'success') {
      setTimeout(() => app.alerts.dismiss(alertId), 10000);
    }
  },

  /**
   * Edit the poll.
   */
  editAction(poll: Poll): void {
    m.route.set(app.route('fof.polls.composer', { id: poll.id() }));
  },

  async publishAction(poll: Poll): Promise<void> {
    await poll.publish();
    const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.poll_controls.publish_success'));
    setTimeout(() => app.alerts.dismiss(alertId), 10000);
    m.redraw();
  },

  async cancelScheduleAction(poll: Poll): Promise<void> {
    await poll.publish({ scheduledFor: null });
    const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.poll_controls.cancel_schedule_success'));
    setTimeout(() => app.alerts.dismiss(alertId), 10000);
    m.redraw();
  },

  async unpublishAction(poll: Poll): Promise<void> {
    if (!confirm(app.translator.trans('fof-polls.forum.poll_controls.unpublish_confirmation') as string)) return;
    try {
      await poll.unpublish();
      const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.poll_controls.unpublish_success'));
      setTimeout(() => app.alerts.dismiss(alertId), 10000);
      m.redraw();
    } catch (e: any) {
      app.alerts.show({ type: 'error' }, app.translator.trans('fof-polls.forum.poll_controls.unpublish_error_has_votes'));
    }
  },
};
