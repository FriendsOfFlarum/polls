import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Poll from '../models/Poll';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollForm from './Poll/PollForm';
import PollFormState from '../states/PollFormState';
import ComposePollHero from './ComposePollHero';
import Button from 'flarum/common/components/Button';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import IndexPage from 'flarum/forum/components/IndexPage';

export default class ComposePollPage extends Page {
  poll: Poll | null | undefined = null;

  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    // prevent users from accessing the page if they can't start global polls or if they are disabled altogether
    if (!app.forum.attribute<boolean>('globalPollsEnabled') || !app.forum.attribute<boolean>('canStartGlobalPolls')) {
      m.route.set('/');
      return;
    }

    this.bodyClass = 'App--compose-poll';

    // Get the `edit` parameter from the URL
    const editId = m.route.param('id');

    // either load the poll we're editing or create a new one
    const pollPromise = editId ? this.loadEditingPoll(editId) : Promise.resolve(PollFormState.createNewPoll());

    pollPromise.then((poll: Poll | null | undefined) => {
      this.poll = poll;

      if (poll?.exists && !poll.canEdit()) {
        m.route.set('/');
        return;
      }

      app.history.push('compose-poll', app.translator.trans(`fof-polls.forum.compose.${!!this.poll?.id() ? 'edit' : 'add'}_title`) as string);
      app.setTitle(app.translator.trans(`fof-polls.forum.compose.${!!this.poll?.id() ? 'edit' : 'add'}_title`) as string);

      m.redraw();
    });
  }

  async loadEditingPoll(editId: string) {
    const alreadyLoaded = app.store.getById<Poll>('poll', editId);

    if (alreadyLoaded) return alreadyLoaded;

    this.loading = true;

    const poll = await app.store.find<Poll>('fof/polls', editId);

    this.loading = false;

    return poll;
  }

  view(): Mithril.Children {
    if (this.loading || !this.poll) {
      return <LoadingIndicator />;
    }

    return (
      <div className="ComposePollPage">
        <ComposePollHero poll={this.poll} />
        <div className="container">
          <div className="sideNavContainer">
            <nav className="PollsPage-nav sideNav">
              <ul>{listItems(this.sidebarItems().toArray())}</ul>
            </nav>
            <div className="sideNavOffset">
              <PollForm poll={this.poll} onsubmit={this.onsubmit.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  async onsubmit(data: Object, state: PollFormState) {
    const isNew = state.poll.id() === undefined;
    await state.save(data);

    const alertAttrs = isNew
      ? {
          type: 'success',
          controls: [
            <Button
              className="Button Button--link"
              onclick={() =>
                m.route.set(
                  app.route('fof.polls.compose', {
                    id: state.poll.id(),
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

    // Show success alert
    const alertId = app.alerts.show(alertAttrs, app.translator.trans('fof-polls.forum.compose.success'));

    // Hide alert after 10 seconds
    setTimeout(() => app.alerts.dismiss(alertId), 10000);

    if (isNew) {
      m.route.set(app.route('fof.polls.list'));
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
