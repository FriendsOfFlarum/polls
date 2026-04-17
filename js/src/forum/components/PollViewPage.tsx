import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import PollModel from '../models/Poll';
import PollView from './PollView';
import PollPageHero from './PollPageHero';

export default class PollViewPage extends Page<IPageAttrs> {
  loading: boolean = false;
  poll: PollModel | null | undefined = null;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    const editId = m.route.param('id');
    this.poll = app.store.getById<PollModel>('poll', editId);

    if (!this.poll) {
      this.loading = true;

      app.store.find<PollModel>('polls', editId).then((item) => {
        this.poll = item;
        this.loading = false;
        app.current.set('poll', item);
        app.setTitle(this.poll.question());
        m.redraw();
      });
    }
  }

  view(): Mithril.Children {
    return (
      <PageStructure className="PollViewPage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)} loading={this.loading}>
        {this.contentItems().toArray()}
      </PageStructure>
    );
  }

  hero(): Mithril.Children {
    return <PollPageHero />;
  }

  sidebar(): Mithril.Children {
    return <IndexSidebar />;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.poll) {
      items.add('poll', <PollView poll={this.poll} />);
    }

    return items;
  }
}
