import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import ItemList from 'flarum/common/utils/ItemList';
import listItems from 'flarum/common/helpers/listItems';
import extractText from 'flarum/common/utils/extractText';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import PollList from './Poll/PollList';
import PollListState from '../states/PollListState';
import PollPageHero from './PollPageHero';
import PollsIndexSidebar from './PollsIndexSidebar';

export default class PollsPage extends Page<IPageAttrs, PollListState> {
  state!: PollListState;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    const defaultSort = String(app.forum.attribute('pollsDirectoryDefaultSort')) || 'newest';

    this.state = new PollListState({
      sort: defaultSort,
      filter: m.route.param('filter'),
    });

    this.state.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  view(): Mithril.Children {
    return (
      <PageStructure className="PollsPage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)} loading={!this.state}>
        {this.contentItems().toArray()}
      </PageStructure>
    );
  }

  hero(): Mithril.Children {
    return <PollPageHero />;
  }

  sidebar(): Mithril.Children {
    return <PollsIndexSidebar />;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('toolbar', <div className="IndexPage-toolbar">{this.toolbarItems().toArray()}</div>, 100);
    items.add('pollList', <PollList state={this.state} />, 10);

    return items;
  }

  toolbarItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('view', <ul className="IndexPage-toolbar-view">{listItems(this.viewItems().toArray())}</ul>, 100);
    items.add('action', <ul className="IndexPage-toolbar-action">{listItems(this.actionItems().toArray())}</ul>, 10);

    return items;
  }

  viewItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const sortMap = this.state.sortMap();

    const currentSortKey =
      Object.keys(sortMap).find((key) => sortMap[key] === this.state.getSort()) ||
      String(app.forum.attribute('pollsDirectoryDefaultSort')) ||
      'newest';

    const sortOptions = Object.keys(sortMap).reduce((acc: Record<string, string>, sortId) => {
      acc[sortId] = extractText(app.translator.trans(`fof-polls.forum.polls_list.sort_dropdown.${sortId}`));
      return acc;
    }, {});

    items.add(
      'sort',
      <Dropdown
        buttonClassName="Button"
        label={sortOptions[currentSortKey] || app.translator.trans('fof-polls.forum.polls_list.sort_dropdown.default')}
      >
        {Object.keys(sortOptions).map((value) => (
          <Button
            icon={currentSortKey === value ? 'fas fa-check' : true}
            onclick={() => this.state.setSort(sortMap[value])}
            active={currentSortKey === value}
          >
            {sortOptions[value]}
          </Button>
        ))}
      </Dropdown>
    );

    return items;
  }

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'refresh',
      <Button
        aria-label={extractText(app.translator.trans('core.forum.index.refresh_tooltip'))}
        icon="fas fa-sync"
        className="Button Button--icon"
        onclick={() => this.state.refresh()}
      />
    );

    return items;
  }
}
