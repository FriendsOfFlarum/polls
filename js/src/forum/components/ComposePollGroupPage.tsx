import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import PollGroup from '../models/PollGroup';
import PollGroupForm from './PollGroup/PollGroupForm';
import PollGroupFormState from '../states/PollGroupFormState';
import ComposeHero from './ComposeHero';

export default class ComposePollGroupPage extends Page {
  pollGroup: PollGroup | null | undefined = null;
  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('pollGroupsEnabled') || !app.forum.attribute<boolean>('canStartPollGroup')) {
      m.route.set('/');
      return;
    }

    this.bodyClass = 'App--compose-poll-group';

    const editId = m.route.param('id');
    const promise = editId ? this.loadEditingPollGroup(editId) : Promise.resolve(PollGroupFormState.createNewPollGroup());

    promise.then((pollGroup: PollGroup | null | undefined) => {
      this.pollGroup = pollGroup;

      if (pollGroup?.exists && !pollGroup.canEdit()) {
        m.route.set('/');
        return;
      }

      const titleKey = `fof-polls.forum.poll_groups.composer.${this.pollGroup?.id() ? 'edit' : 'add'}_title`;
      app.history.push('compose-poll-group', app.translator.trans(titleKey) as string);
      app.setTitle(app.translator.trans(titleKey) as string);

      m.redraw();
    });
  }

  async loadEditingPollGroup(editId: string): Promise<PollGroup> {
    const cached = app.store.getById<PollGroup>('poll_groups', editId);
    if (cached) return cached;

    this.loading = true;
    const pollGroup = await app.store.find<PollGroup>('poll_groups', editId);
    this.loading = false;
    return pollGroup;
  }

  view(): Mithril.Children {
    return (
      <PageStructure
        className="ComposePollGroupPage"
        hero={this.hero.bind(this)}
        sidebar={this.sidebar.bind(this)}
        loading={this.loading || !this.pollGroup}
      >
        {this.contentItems().toArray()}
      </PageStructure>
    );
  }

  hero(): Mithril.Children {
    if (!this.pollGroup) return null;

    return (
      <ComposeHero
        item={this.pollGroup}
        className="ComposePollGroupHero"
        translationPrefix="fof-polls.forum.poll_groups.composer"
        managerRoute="fof.polls.groups.list"
        managerIcon="fas fa-layer-group"
        managerLabel={app.translator.trans('fof-polls.forum.poll_groups.composer.groups_manager')}
        viewRoute="fof.polls.groups.view"
        viewIcon="far fa-arrow-up-right-from-square"
        viewLabel={app.translator.trans('fof-polls.forum.poll_groups.composer.view_group')}
      />
    );
  }

  sidebar(): Mithril.Children {
    return <IndexSidebar />;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.pollGroup) {
      items.add('form', <PollGroupForm pollGroup={this.pollGroup} onsubmit={this.onsubmit.bind(this)} />);
    }

    return items;
  }

  async onsubmit(data: Object, state: PollGroupFormState) {
    const isNew = state.pollGroup.id() === undefined;
    await state.save(data);

    const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-polls.forum.poll_groups.composer.success'));
    setTimeout(() => app.alerts.dismiss(alertId), 10000);

    if (isNew) {
      m.route.set(app.route('fof.polls.groups.list'));
    }
  }
}
