import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Poll from '../models/Poll';
import Component from 'flarum/common/Component';
import { slug } from '../../common';
import ComposePollPage from '../components/ComposePollPage';
import PollsPage from '../components/PollsPage';
import ItemList from 'flarum/common/utils/ItemList';
import Separator from 'flarum/common/components/Separator';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';

const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.poll_controls`;

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
      const controls: Mithril.Children[] = this[section + 'Controls'](poll, context).toArray();
      if (controls.length) {
        controls.forEach((item) => items.add(item.itemName, item));
        items.add(section + 'Separator', <Separator />);
      }
    });

    return items;
  },

  /**
   * Get controls for direkt modifcation actions on polls (e.g. vote, view voters).
   */
  pollControls(poll: Poll, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('view', <Link href={app.route('fof_polls_list', { id: poll.id() })}>{t(`${prfx}.view_label`)}</Link>);

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
        <Button icon="fas fa-pen" onclick={this.editAction.bind(this, poll)}>
          {t(`${prfx}.edit_label`)}
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
        <Button icon="fas fa-times" onclick={this.deleteAction.bind(this, poll)}>
          {t(`${prfx}.delete_label`)}
        </Button>
      );
    }

    return items;
  },

  /**
   * Delete the user.
   */
  deleteAction(poll: Poll): void {
    if (!confirm(t(`${prfx}.delete_confirmation`))) {
      return;
    }

    poll
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
      success: `${prfx}.delete_success_message`,
      error: `${prfx}.delete_error_message`,
    }[type]!;

    app.alerts.show({ type }, t(message, { poll: poll }));
  },

  /**
   * Edit the poll.
   */
  editAction(poll: Poll): void {
    m.route.set(app.route('fof_polls_compose', { id: poll.id() }));
  },
};
