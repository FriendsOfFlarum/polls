import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import Page from 'flarum/common/components/Page';
import IndexPage from 'flarum/forum/components/IndexPage';
import Poll from './Poll';
import PollList from './Poll/PollList';

export default class PollsPage extends Page {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);
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
              <PollList />
            </div>
          </div>
        </div>
      </div>
    );
  }

  sidebarItems() {
    return IndexPage.prototype.sidebarItems();
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
}
