import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollGroup from '../models/PollGroup';
import PollGroupForm from './PollGroupForm';
import PollGroupFormState from '../states/PollGroupFormState';
import Button from 'flarum/common/components/Button';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import IndexPage from 'flarum/forum/components/IndexPage';
import ComposePollGroupHero from './ComposePollGroupHero';

export default class ComposePollGroupPage extends Page {
  pollGroup: PollGroup | null | undefined = null;
  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    // Permission check (adjust attribute names as needed)
    if (!app.forum.attribute<boolean>('pollGroupsEnabled') || !app.forum.attribute<boolean>('canStartPollGroup')) {
      m.route.set('/');
      return;
    }

    this.bodyClass = 'App--compose-poll-group';

    const editId = m.route.param('id');
    const pollGroupPromise = editId ? this.loadEditingPollGroup(editId) : Promise.resolve(PollGroupFormState.createNewPollGroup());

    pollGroupPromise.then((pollGroup: PollGroup | null | undefined) => {
      this.pollGroup = pollGroup;

      if (pollGroup?.exists && !pollGroup.canEdit()) {
        m.route.set('/');
        return;
      }

      app.history.push(
        'compose-poll-group',
        app.translator.trans(`fof-polls.forum.pollgroup.${!!this.pollGroup?.id() ? 'edit' : 'add'}_title`) as string
      );
      app.setTitle(app.translator.trans(`fof-polls.forum.pollgroup.${!!this.pollGroup?.id() ? 'edit' : 'add'}_title`) as string);

      m.redraw();
    });
  }

  async loadEditingPollGroup(editId: string) {
    const alreadyLoaded = app.store.getById<PollGroup>('poll_groups', editId);
    if (alreadyLoaded) return alreadyLoaded;

    this.loading = true;
    const pollGroup = await app.store.find<PollGroup>('fof/polls/groups', editId);
    this.loading = false;
    return pollGroup;
  }

  view(): Mithril.Children {
    if (this.loading || !this.pollGroup) {
      return <LoadingIndicator />;
    }

    return (
      <div className="ComposePollGroupPage">
        <ComposePollGroupHero pollGroup={this.pollGroup} />
        <div className="container">
          <div className="sideNavContainer">
            <nav className="PollsPage-nav sideNav">
              <ul>{listItems(this.sidebarItems().toArray())}</ul>
            </nav>
            <div className="sideNavOffset">
              <PollGroupForm pollGroup={this.pollGroup} onsubmit={this.onsubmit.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  async onsubmit(data: Object, state: PollGroupFormState) {
    const isNew = state.pollGroup.id() === undefined;
    await state.save(data);

    const alertAttrs = isNew
      ? {
          type: 'success',
          controls: [
            <Button
              className="Button Button--link"
              onclick={() =>
                m.route.set(
                  app.route('fof.polls.groups.compose', {
                    id: state.pollGroup.id(),
                  })
                )
              }
            >
              {app.translator.trans('fof-polls.forum.compose.continue_editing')}
            </Button>,
          ],
        }
      : {
          type: 'success',
        };

    const alertId = app.alerts.show(alertAttrs, app.translator.trans('fof-polls.forum.pollgroup.success'));
    setTimeout(() => app.alerts.dismiss(alertId), 10000);

    if (isNew) {
      m.route.set(app.route('fof.polls.groups.list'));
    }
  }

  sidebarItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'nav',
      <SelectDropdown
        buttonClassName="Button"
        className="App-titleControl"
        accessibleToggleLabel={app.translator.trans('core.forum.index.toggle_sidenav_dropdown_accessible_label')}
      >
        {this.navItems().toArray()}
      </SelectDropdown>
    );

    return items;
  }

  navItems() {
    return IndexPage.prototype.navItems();
  }
}
