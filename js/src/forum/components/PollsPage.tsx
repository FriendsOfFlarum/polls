import Mithril from 'mithril';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import Page, {IPageAttrs} from 'flarum/common/components/Page';
import IndexPage from 'flarum/forum/components/IndexPage';
import PollList from './Poll/PollList';
import LogInModal from "flarum/forum/components/LogInModal";
import extractText from 'flarum/common/utils/extractText';
import PollListState from '../states/PollListState';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import Acl from "../../common/Acl";

export default class PollsPage extends Page<IPageAttrs, PollListState> {
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
                {/* <ul className="IndexPage-toolbar-action">{listItems(this.actionItems().toArray())}</ul> */}
              </div>
              <PollList state={this.state} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  sidebarItems() {
    const items = new ItemList<Mithril.Children>();
    const canStartPoll = Acl.canStartPoll();

    items.add(
      'newGlobalPoll',
      <Button
        icon="fas fa-edit"
        className="Button Button--primary IndexPage-newDiscussion"
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

  // actionItems() {
  //   return IndexPage.prototype.actionItems();
  // }

  viewItems() {
    return IndexPage.prototype.viewItems();
  }
  navItems() {
    return IndexPage.prototype.navItems();
  }

  /**
   * Change to create new poll page
   */
  newPollAction():void {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      return;
    }

    m.route.set(app.route('fof_polls_compose'));
  }
}
