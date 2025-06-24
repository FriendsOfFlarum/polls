import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PollGroupListState from '../states/PollGroupListState';
import PollGroup from '../models/PollGroup';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import IndexPage from 'flarum/forum/components/IndexPage';
import listItems from 'flarum/common/helpers/listItems';
import app from 'flarum/forum/app';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import IndexPageHero from './PollPageHero';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';

export abstract class AbstractPollGroupsPage extends Page<IPageAttrs, PollGroupListState> {
  loading: boolean = false;
  pollGroup: PollGroup | null = null;
  pollGroups: PollGroup[] = [];

  view(): Mithril.Children {
    return <div className="PollGroupsPage">{this.pageContent().toArray()}</div>;
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
    return <div className="PollGroupsPage-content sideNavOffset">{this.contentItems().toArray()}</div>;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.loading) {
      items.add('loading', <LoadingIndicator />);
    }

    return items;
  }

  hero(): Mithril.Children {
    return <IndexPageHero title={app.translator.trans('fof-polls.forum.poll_groups.list_page.title')} icon="fas fa-layer-group" />;
  }

  sidebar(): Mithril.Children {
    return (
      <nav className="PollGroupsPage-nav IndexPage-nav sideNav">
        <ul>{listItems(this.sidebarItems().toArray())}</ul>
      </nav>
    );
  }

  sidebarItems(): ItemList<Mithril.Children> {
    const items = IndexPage.prototype.sidebarItems();
    const canStartPoll = app.forum.attribute<boolean>('canStartGlobalPolls');

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

    items.remove('newDiscussion');

    if (canStartPoll) {
      items.add(
        'newPollGroup',
        <Button
          icon="fas fa-edit"
          className="Button Button--primary App-primaryControl PollsPage-newPoll"
          itemClassName="App-primaryControl"
          onclick={() => {
            this.newPollGroupAction();
          }}
          disabled={!canStartPoll}
        >
          {app.translator.trans(
            `fof-polls.forum.poll_groups.list_page.${canStartPoll ? 'start_poll_group_button' : 'cannot_start_poll_group_button'}`
          )}
        </Button>,
        100
      );
    }

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

  newPollGroupAction(): void {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      return;
    }

    m.route.set(app.route('fof.polls.group.compose'));
  }
}
