import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import ItemList from 'flarum/common/utils/ItemList';
import listItems from 'flarum/common/helpers/listItems';
import extractText from 'flarum/common/utils/extractText';
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

const STATUSES: PollStatus[] = ['all', 'published', 'draft'];

// So that /polls/all?filter[isDraft]=1 reads "Drafts", not "All".
function statusFromUrl(): PollStatus {
  const raw = new URLSearchParams(window.location.search).get('filter[isDraft]');

  if (raw === '1' || raw === 'true') return 'draft';
  if (raw === '0' || raw === 'false') return 'published';

  return 'all';
}

export default class PollsPage extends Page<IPageAttrs, PollListState> {
  state!: PollListState;
  status: PollStatus = 'all';

  oninit(vnode: Mithril.Vnode<IPageAttrs, this>) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    this.bodyClass = 'App--polls';
    this.status = statusFromUrl();

    this.state = new PollListState({
      // The setting stores an API sort value; the list state works in keys.
      sort: PollListState.sortKey(String(app.forum.attribute('pollsDirectoryDefaultSort') || '')),
      filter: { isDraft: STATUS_FILTER_VALUE[this.status] },
    });

    this.state.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  view(): Mithril.Children {
    if (!this.state) return null;

    return (
      <PageStructure className="PollsPage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)}>
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

    items.add(
      'status',
      <SelectDropdown buttonClassName="Button" defaultLabel={app.translator.trans('fof-polls.forum.polls_list.status_filter.all')}>
        {STATUSES.map((status) => (
          <Button active={this.status === status} onclick={() => this.setStatus(status)}>
            {app.translator.trans(`fof-polls.forum.polls_list.status_filter.${status}`)}
          </Button>
        ))}
      </SelectDropdown>,
      10
    );

    const sortMap = this.state.sortMap();
    const currentSort = this.state.getSort();

    items.add(
      'sort',
      <SelectDropdown buttonClassName="Button" defaultLabel={app.translator.trans('fof-polls.forum.polls_list.sort_dropdown.newest')}>
        {Object.keys(sortMap).map((key) => (
          <Button active={currentSort === key} onclick={() => this.state.changeSort(key)}>
            {app.translator.trans(`fof-polls.forum.polls_list.sort_dropdown.${key}`)}
          </Button>
        ))}
      </SelectDropdown>,
      0
    );

    return items;
  }

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'refresh',
      <Button
        className="Button Button--icon"
        icon="fas fa-sync"
        aria-label={extractText(app.translator.trans('core.forum.index.refresh_tooltip'))}
        onclick={() => this.state.refresh()}
      />
    );

    return items;
  }

  setStatus(status: PollStatus): void {
    if (this.status === status) return;

    this.status = status;

    const params = this.state.getParams();

    this.state.refreshParams({ ...params, filter: { ...(params.filter || {}), isDraft: STATUS_FILTER_VALUE[status] } }, 1);
  }
}
