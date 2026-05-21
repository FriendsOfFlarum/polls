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

type PollStatus = 'all' | 'published' | 'draft';

const STATUS_FILTER_VALUE: Record<PollStatus, string> = {
  all: 'any',
  published: '0',
  draft: '1',
};

/**
 * Reverse lookup: `filter[isDraft]` URL value → status dropdown key. Anything
 * else (including missing) falls back to "all", matching the server-side
 * default in PollsDirectory.
 */
function statusFromUrl(): PollStatus {
  const raw = new URLSearchParams(window.location.search).get('filter[isDraft]');
  if (raw === '1' || raw === 'true') return 'draft';
  if (raw === '0' || raw === 'false') return 'published';
  return 'all';
}

export default class PollsPage extends Page<IPageAttrs, PollListState> {
  state!: PollListState;
  status: PollStatus = 'all';

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    const defaultSort = String(app.forum.attribute('pollsDirectoryDefaultSort')) || 'newest';

    // Keep the dropdown label honest when landing via a share link like
    // /polls/all?filter[isDraft]=1 — otherwise the UI would read "All" while
    // the list is actually drafts-only.
    this.status = statusFromUrl();

    this.state = new PollListState({
      sort: defaultSort,
      filter: { isDraft: STATUS_FILTER_VALUE[this.status] },
    });

    this.state.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  setStatus(status: PollStatus): void {
    if (this.status === status) return;
    this.status = status;

    const params = this.state.getParams();
    this.state.refreshParams(
      {
        ...params,
        filter: { ...(params.filter || {}), isDraft: STATUS_FILTER_VALUE[status] },
      },
      1
    );
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

    const statusKeys: PollStatus[] = ['all', 'published', 'draft'];
    const statusLabels: Record<PollStatus, Mithril.Children> = {
      all: app.translator.trans('fof-polls.forum.polls_list.status_filter.all'),
      published: app.translator.trans('fof-polls.forum.polls_list.status_filter.published'),
      draft: app.translator.trans('fof-polls.forum.polls_list.status_filter.draft'),
    };

    items.add(
      'status',
      <Dropdown buttonClassName="Button" label={statusLabels[this.status]}>
        {statusKeys.map((key) => {
          const active = this.status === key;
          return (
            <Button icon={active ? 'fas fa-check' : true} active={active} onclick={() => this.setStatus(key)}>
              {statusLabels[key]}
            </Button>
          );
        })}
      </Dropdown>,
      10
    );

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
      </Dropdown>,
      0
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
