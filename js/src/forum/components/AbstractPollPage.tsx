import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PollListState from '../states/PollListState';
import Poll from '../models/Poll';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import IndexPage from 'flarum/forum/components/IndexPage';
import listItems from 'flarum/common/helpers/listItems';
import app from 'flarum/forum/app';
import SelectDropdown from 'flarum/common/components/SelectDropdown';

export abstract class AbstractPollPage extends Page<IPageAttrs, PollListState> {
  loading: boolean = false;
  poll: Poll | null | undefined = null;
  polls: Poll[] = [];

  view(): Mithril.Children {
    return <div className="PollsPage">{this.pageContent().toArray()}</div>;
  }

  pageContent(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('hero', this.hero(), 100);
    items.add('main', <div className="container">{this.mainContent().toArray()}</div>, 10);

    return items;
  }

  mainContent(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('sidebar', this.sidebar(), 100);
    items.add('content', this.content(), 10);

    return items;
  }

  content(): Mithril.Children {
    return <div className="PollsPage-content sideNavOffset">{this.contentItems().toArray()}</div>;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.loading) {
      items.add('loading', <LoadingIndicator />);
    }

    return items;
  }

  hero(): Mithril.Children {
    return IndexPage.prototype.hero();
  }

  sidebar(): Mithril.Children {
    return (
      <nav className="PollsPage-nav IndexPage-nav sideNav">
        <ul>{listItems(this.sidebarItems().toArray())}</ul>
      </nav>
    );
  }

  sidebarItems(): ItemList<Mithril.Children> {
    const items = IndexPage.prototype.sidebarItems();

    items.setContent(
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

  navItems(): ItemList<Mithril.Children> {
    const items = IndexPage.prototype.navItems();

    if (app.initializers.has('flarum-tags')) {
      // remove the tags from the nav items
      items.remove('separator');
      items.remove('moreTags');

      // each tag is added using the key "tag{id}". We need to remove all of them
      for (const key in items.toObject()) {
        if (key.startsWith('tag') && key !== 'tags') {
          items.remove(key);
        }
      }
    }

    return items;
  }
}
