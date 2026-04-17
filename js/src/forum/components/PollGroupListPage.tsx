import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import PollGroupList from './PollGroup/PollGroupList';
import PollGroupListState from '../states/PollGroupListState';
import PollPageHero from './PollPageHero';

export default class PollGroupListPage extends Page<IPageAttrs, PollGroupListState> {
  state!: PollGroupListState;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('canViewPollGroups')) {
      m.route.set('/');
      return;
    }

    this.state = new PollGroupListState({
      sort: m.route.param('sort'),
      filter: m.route.param('filter'),
    });

    this.state.refresh();
  }

  view(): Mithril.Children {
    return (
      <PageStructure className="PollGroupListPage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)} loading={!this.state}>
        {this.contentItems().toArray()}
      </PageStructure>
    );
  }

  hero(): Mithril.Children {
    return <PollPageHero title={app.translator.trans('fof-polls.forum.poll_groups.list_page.title')} icon="fas fa-layer-group" />;
  }

  sidebar(): Mithril.Children {
    return <IndexSidebar />;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('pollGroupList', <PollGroupList state={this.state} />, 10);

    return items;
  }
}
