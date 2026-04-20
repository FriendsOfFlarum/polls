import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import IndexPage from 'flarum/forum/components/IndexPage';
import PollList from './Poll/PollList';
import LogInModal from 'flarum/forum/components/LogInModal';
import extractText from 'flarum/common/utils/extractText';
import PollListState from '../states/PollListState';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollView from './PollView';
import { AbstractPollPage } from './AbstractPollPage';
import Dropdown from 'flarum/common/components/Dropdown';

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

export default class PollsPage extends AbstractPollPage {
  defaultSort?: string;
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

    this.state.refreshParams({ ...this.state.getParams(), filter: { isDraft: STATUS_FILTER_VALUE[status] } }, 1);
  }

  view(): Mithril.Children {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    if (this.poll) {
      return (
        <div className="PollsListPage">
          <div className="container">
            <PollView poll={this.poll} />
          </div>
        </div>
      );
    }

    return (
      <div className="PollsListPage">
        {super.hero()}
        <div className="container">
          <div className="sideNavContainer">
            <nav className="PollsListPage-nav sideNav">
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
    const items = new ItemList<Mithril.Children>();
    const sortMap = this.state.sortMap();

    const currentSortKey = Object.keys(sortMap).find((key) => sortMap[key] === this.state.getSort()) || this.defaultSort; // fallback to '-createdAt' or your default

    const sortOptions = Object.keys(sortMap).reduce((acc: any, sortId) => {
      acc[sortId] = app.translator.trans(`fof-polls.forum.polls_list.sort_dropdown.${sortId}`);
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
        label={currentSortKey ? sortOptions[currentSortKey] : app.translator.trans('fof-polls.forum.polls_list.sort_dropdown.default')}
      >
        {Object.keys(sortOptions).map((value) => {
          const label = sortOptions[value];
          const active = currentSortKey === value;

          return (
            <Button
              icon={active ? 'fas fa-check' : true}
              onclick={() => {
                this.state.setSort(sortMap[value]);
              }}
              active={active}
            >
              {label}
            </Button>
          );
        })}
      </Dropdown>,
      0
    );

    return items;
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

    m.route.set(app.route('fof.polls.composer'));
  }
}
