import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import IndexPage from 'flarum/forum/components/IndexPage';
import PollList from './Poll/PollList';
import LogInModal from 'flarum/forum/components/LogInModal';
import extractText from 'flarum/common/utils/extractText';
import PollListState from '../states/PollListState';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollModel from '../models/Poll';
import PollView from './PollView';

export default class PollsPage extends Page<IPageAttrs, PollListState> {
  loading: boolean = false;
  poll: PollModel | null = null;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.state = new PollListState({
      sort: m.route.param('sort'),
      filter: m.route.param('filter'),
    });

    this.state.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  oncreate(vnode: Mithril.Vnode) {
    super.oncreate(vnode);
  }

  view(): Mithril.Children {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    if (this.poll) {
      return (
        <div className="PollsPage">
          <div className="container">
            <PollView poll={this.poll} />
          </div>
        </div>
      );
    }

    return (
      <div className="PollsPage">
        {IndexPage.prototype.hero()}
        <div className="container">
          <div className="sideNavContainer">
            <nav className="PollsPage-nav sideNav">
              <ul>{listItems(this.sidebarItems().toArray())}</ul>
            </nav>
            <div className="PollsPage-results sideNavOffset">
              <div className="IndexPage-toolbar">
                <ul className="IndexPage-toolbar-view">{listItems(this.viewItems().toArray())}</ul>
                <ul className="IndexPage-toolbar-action">{listItems(this.actionItems().toArray())}</ul>
              </div>
              <PollList state={this.state} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  sidebarItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const canStartPoll = app.forum.attribute<boolean>('canStartGlobalPolls');

    items.add(
      'newGlobalPoll',
      <Button
        icon="fas fa-edit"
        className="Button Button--primary App-primaryControl PollsPage-newPoll"
        itemClassName="App-primaryControl"
        onclick={() => {
          this.newPollAction();
        }}
        disabled={!canStartPoll}
      >
        {app.translator.trans(`fof-polls.forum.poll.${canStartPoll ? 'start_poll_button' : 'cannot_start_poll_button'}`)}
      </Button>
    );

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

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'refresh',
      Button.component({
        title: app.translator.trans('fof-polls.forum.page.refresh_tooltip'),
        icon: 'fas fa-sync',
        className: 'Button Button--icon',
        onclick: () => {
          this.state.refresh();
        },
      })
    );

    return items;
  }

  viewItems() {
    return IndexPage.prototype.viewItems();
  }

  navItems() {
    return IndexPage.prototype.navItems();
  }

  /**
   * Change to create new poll page
   */
  newPollAction(): void {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      return;
    }

    m.route.set(app.route('fof.polls.compose'));
  }
}
