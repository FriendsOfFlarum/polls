import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import extractText from 'flarum/common/utils/extractText';
import IndexPage from 'flarum/forum/components/IndexPage';
import ItemList from 'flarum/common/utils/ItemList';
import listItems from 'flarum/common/helpers/listItems';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import LinkButton from 'flarum/common/components/LinkButton';
import Select from 'flarum/common/components/Select';
import Button from 'flarum/common/components/Button';
import Mithril from 'mithril';

export default class PollsDirectory extends Page {
  oncreate(vnode: Mithril.Vnode) {
    super.oncreate(vnode);

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  view() {
    return (
      <div className="IndexPage">
        {IndexPage.prototype.hero()}
        <div className="container">
          <div className="sideNavContainer">
            <nav className="IndexPage-nav sideNav">
              <ul>{listItems(this.sidebarItems().toArray())}</ul>
            </nav>
            <div className="IndexPage-results sideNavOffset">
              <div className="IndexPage-toolbar">
                <ul className="IndexPage-toolbar-view">{listItems(this.viewItems().toArray())}</ul>
                <ul className="IndexPage-toolbar-action">{listItems(this.actionItems().toArray())}</ul>
              </div>
              {/* <UserDirectoryList state={this.state} /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Our own sidebar. Re-uses Index.sidebarItems as the base
   * Elements added here will only show up on the user directory page
   */
  sidebarItems(): ItemList<Mithril.Children> {
    const items = IndexPage.prototype.sidebarItems();

    items.setContent(
      'nav',
      SelectDropdown.component(
        {
          buttonClassName: 'Button',
          className: 'App-titleControl',
        },
        this.navItems().toArray()
      )
    );

    return items;
  }

  /**
   * Our own sidebar navigation. Re-uses Index.navItems as the base
   * Elements added here will only show up on the user directory page
   */
  navItems(): ItemList<Mithril.Children> {
    const items = IndexPage.prototype.navItems();
    const params = this.stickyParams();

    items.setContent(
      'fof-polls-directory',
      LinkButton.component(
        {
          href: app.route('fof_polls_directory', params),
          icon: 'fas fa-poll',
        },
        app.translator.trans('fof-polls.forum.page.nav')
      )
    );

    return items;
  }

  stickyParams() {
    return {
      sort: m.route.param('sort'),
      q: m.route.param('q'),
    };
  }

  changeParams(sort: string) {
    const params = this.params();

    if (sort === app.forum.attribute('pollsDirectoryDefaultSort')) {
      delete params.sort;
    } else {
      params.sort = sort;
    }

    this.state.refreshParams(params);

    const routeParams = { ...params };
    delete routeParams.qBuilder;

    m.route.set(app.route('fof_polls_directory', routeParams));
  }

  viewItems() {
    const items = new ItemList();
    const sortMap = this.state.sortMap();

    const sortOptions = {};
    for (const i in sortMap) {
      sortOptions[i] = app.translator.trans('fof-polls.lib.sort.' + i);
    }

    items.add(
      'sort',
      Select.component({
        options: sortOptions,
        value: this.state.getParams().sort || app.forum.attribute('pollsDirectoryDefaultSort'),
        onchange: this.changeParams.bind(this),
      }),
      100
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
}
