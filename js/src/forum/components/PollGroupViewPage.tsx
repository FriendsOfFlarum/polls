import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import PollGroup from '../models/PollGroup';
import PollGroupListItem from './PollGroup/PollGroupListItem';
import PollPageHero from './PollPageHero';

export default class PollGroupViewPage extends Page<IPageAttrs> {
  loading: boolean = false;
  pollGroup: PollGroup | null = null;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('canViewPollGroups')) {
      m.route.set('/');
      return;
    }

    const editId = m.route.param('id');
    this.pollGroup = app.store.getById<PollGroup>('poll_groups', editId) || null;

    if (!this.pollGroup) {
      this.loading = true;

      app.store.find<PollGroup>('poll_groups', editId).then((item) => {
        this.pollGroup = item;
        this.loading = false;
        app.setTitle(this.pollGroup.name());
        m.redraw();
      });
    }
  }

  view(): Mithril.Children {
    return (
      <PageStructure className="PollGroupViewPage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)} loading={this.loading}>
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

    if (this.pollGroup) {
      items.add('pollGroup', <PollGroupListItem pollGroup={this.pollGroup} />);
    }

    return items;
  }
}
