import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import Component from 'flarum/common/Component';
import ComposePollPage from '../components/ComposePollPage';
import PollsPage from '../components/PollsPage';
import ItemList from 'flarum/common/utils/ItemList';
import Separator from 'flarum/common/components/Separator';
import Button from 'flarum/common/components/Button';

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

    ['poll', 'moderation', 'destructive'].forEach((section) => {
      const controls = (this[section + 'Controls'](poll, context) as ItemList<Mithril.Children>).toArray();
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
    return new ItemList<Mithril.Children>();
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

    return items;
  },

  /**
   * Get controls for a user which are destructive (e.g. delete).
   * @protected
   */
  destructiveControls(poll: Poll, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

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
   * Delete the user.
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

    app.alerts.show({ type }, app.translator.trans(message, { poll: poll }));
  },

  /**
   * Edit the poll.
   */
  editAction(poll: Poll): void {
    m.route.set(app.route('fof.polls.compose', { id: poll.id() }));
  },
};
