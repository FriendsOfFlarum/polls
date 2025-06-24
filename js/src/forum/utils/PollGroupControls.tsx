import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import PollGroup from '../models/PollGroup';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Separator from 'flarum/common/components/Separator';
import Button from 'flarum/common/components/Button';
import ComposePollGroupPage from '../components/ComposePollGroupPage';
import CreatePollModal from '../components/CreatePollModal';
import PollModelAttributes from '../models/PollModelAttributes';

/**
 * The `PollGroupControls` utility constructs a list of buttons for a poll group which
 * perform actions on it.
 */
export default {
  /**
   * Get a list of controls for a poll group.
   */
  controls(pollGroup: PollGroup, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    const sections: ('moderation' | 'destructive')[] = ['moderation', 'destructive'];
    sections.forEach((section) => {
      const controls = (this[`${section}Controls`](pollGroup, context) as ItemList<Mithril.Children>).toArray();
      if (controls.length) {
        controls.forEach((item) => items.add(item.itemName, item));
        items.add(section + 'Separator', <Separator />);
      }
    });

    return items;
  },

  /**
   * Get controls for a poll group pertaining to moderation (e.g. edit).
   */
  moderationControls(pollGroup: PollGroup, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (pollGroup.canEdit()) {
      items.add(
        'edit',
        <Button icon="fas fa-pencil-alt" onclick={this.editAction.bind(this, pollGroup)}>
          {app.translator.trans(`fof-polls.forum.poll_groups.controls.edit_label`)}
        </Button>
      );

      items.add(
        'addPoll',
        <Button icon="fas fa-plus" onclick={this.addPoll.bind(this, pollGroup)}>
          {app.translator.trans(`fof-polls.forum.poll_groups.controls.add_poll_label`)}
        </Button>
      );

      items.add(
        'view',
        <Button icon="far fa-arrow-up-right-from-square" onclick={() => m.route.set(app.route('fof.polls.groups.view', { id: pollGroup.id() }))}>
          {app.translator.trans(`fof-polls.forum.poll_groups.controls.view_label`)}
        </Button>
      );

    }

    return items;
  },

  /**
   * Get controls for a poll group which are destructive (e.g. delete).
   * @protected
   */
  destructiveControls(pollGroup: PollGroup, context: Component): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (pollGroup.canDelete()) {
      items.add(
        'delete',
        <Button icon="far fa-trash-alt" onclick={this.deleteAction.bind(this, pollGroup)}>
          {app.translator.trans(`fof-polls.forum.poll_groups.controls.delete_label`)}
        </Button>
      );
    }

    return items;
  },

  /**
   * Delete the poll group.
   */
  async deleteAction(pollGroup: PollGroup): Promise<void> {
    if (!confirm(app.translator.trans(`fof-polls.forum.poll_groups.controls.delete_confirmation`) as string)) {
      return;
    }

    return pollGroup
      .delete()
      .then(() => {
        this.showDeletionAlert(pollGroup, 'success');
        if (app.current.matches(ComposePollGroupPage, { id: pollGroup.id() })) {
          app.history.back();
        } else {
          window.location.reload();
        }
      })
      .catch(() => this.showDeletionAlert(pollGroup, 'error'));
  },

  /**
   * Show deletion alert of poll group
   */
  showDeletionAlert(pollGroup: PollGroup, type: string): void {
    const message = {
      success: `fof-polls.forum.poll_groups.controls.delete_success_message`,
      error: `fof-polls.forum.poll_groups.controls.delete_error_message`,
    }[type]!;

    app.alerts.show({ type }, app.translator.trans(message, { pollGroup: pollGroup }));
  },

  /**
   * Edit the poll group.
   */
  editAction(pollGroup: PollGroup): void {
    m.route.set(app.route('fof.polls.groups.composer', { id: pollGroup.id() }));
  },

  /**
   * Add poll to group.
   */
  addPoll(pollGroup: PollGroup): void {
    app.modal.show(CreatePollModal, {
      onsubmit: function (data: PollModelAttributes): void {
        app.store
          .createRecord('polls')
          .save(
            {
              ...data,
              relationships: {
                pollGroup: pollGroup,
              },
            },
            {
              data: {
                include: 'options,myVotes,myVotes.option',
              },
            }
          )
          .then((poll) => {
            // @ts-ignore
            pollGroup.rawRelationship('polls')?.push?.({ type: 'polls', id: poll.id() });
            m.redraw();
          });
      },
    });
  },
};
