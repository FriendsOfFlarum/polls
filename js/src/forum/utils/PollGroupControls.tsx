import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Separator from 'flarum/common/components/Separator';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import PollGroup from '../models/PollGroup';
import PollGroupListState from '../states/PollGroupListState';
import PollModelAttributes from '../models/PollModelAttributes';

type Context = Component<any, any>;

export default {
  controls(pollGroup: PollGroup, context: Context): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const sections = ['moderation', 'destructive'] as const;

    sections.forEach((section) => {
      const controls = (this[`${section}Controls`](pollGroup, context) as ItemList<Mithril.Children>).toArray();

      if (!controls.length) return;

      controls.forEach((item: any) => items.add(item.itemName, item));
      items.add(`${section}Separator`, <Separator />);
    });

    return items;
  },

  moderationControls(pollGroup: PollGroup, context: Context): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (pollGroup.canEdit()) {
      items.add(
        'edit',
        <Button icon="fas fa-pencil-alt" onclick={this.editAction.bind(this, pollGroup)}>
          {app.translator.trans('fof-polls.forum.poll_groups.controls.edit_label')}
        </Button>
      );

      items.add(
        'addPoll',
        <Button icon="fas fa-plus" onclick={this.addPoll.bind(this, pollGroup)}>
          {app.translator.trans('fof-polls.forum.poll_groups.controls.add_poll_label')}
        </Button>
      );

      items.add(
        'view',
        <Button icon="far fa-arrow-up-right-from-square" onclick={() => m.route.set(app.route('fof.polls.groups.view', { id: pollGroup.id() }))}>
          {app.translator.trans('fof-polls.forum.poll_groups.controls.view_label')}
        </Button>
      );
    }

    return items;
  },

  destructiveControls(pollGroup: PollGroup, context: Context): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (pollGroup.canDelete()) {
      items.add(
        'delete',
        <Button icon="far fa-trash-alt" onclick={this.deleteAction.bind(this, pollGroup)}>
          {app.translator.trans('fof-polls.forum.poll_groups.controls.delete_label')}
        </Button>
      );
    }

    return items;
  },

  editAction(pollGroup: PollGroup): void {
    m.route.set(app.route('fof.polls.groups.composer', { id: pollGroup.id() }));
  },

  async deleteAction(pollGroup: PollGroup): Promise<void> {
    if (!confirm(extractText(app.translator.trans('fof-polls.forum.poll_groups.controls.delete_confirmation')))) {
      return;
    }

    return pollGroup
      .delete()
      .then(() => {
        this.alert('success', 'fof-polls.forum.poll_groups.controls.delete_success_message');

        if (app.current.matches('ext:fof/polls/forum/components/ComposePollGroupPage', { id: pollGroup.id() })) {
          m.route.set(app.route('fof.polls.groups.list'));
        } else {
          PollGroupListState.notifyDeleted(pollGroup);
        }
      })
      .catch(() => this.alert('error', 'fof-polls.forum.poll_groups.controls.delete_error_message'));
  },

  addPoll(pollGroup: PollGroup): void {
    app.modal.show(() => import('../components/CreatePollModal'), {
      onsubmit: (data: PollModelAttributes) =>
        app.store
          .createRecord('polls')
          .save({ ...data, relationships: { pollGroup } }, { data: { include: 'options,myVotes,myVotes.option' } })
          .then((poll) => {
            (pollGroup as any).rawRelationship('polls')?.push?.({ type: 'polls', id: poll.id() });
            m.redraw();
          }),
    });
  },

  alert(type: 'success' | 'error', key: string): void {
    const id = app.alerts.show({ type }, app.translator.trans(key));

    if (type === 'success') setTimeout(() => app.alerts.dismiss(id), 10000);
  },
};
