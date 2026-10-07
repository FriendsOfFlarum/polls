import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import ItemList from 'flarum/common/utils/ItemList';
import PollModel from '../models/Poll';
import PollView from './PollView';
import PollPageHero from './PollPageHero';
import PollsIndexSidebar from './PollsIndexSidebar';

export default class PollViewPage extends Page<IPageAttrs> {
  loading: boolean = false;
  poll: PollModel | null = null;

  oninit(vnode: Mithril.Vnode<IPageAttrs, this>) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    this.bodyClass = 'App--polls';

    const id = m.route.param('id');
    const cached = app.store.getById<PollModel>('polls', id);

    // Listings load polls without their options, so only a cached poll that
    // already has them can be shown while the full record loads.
    if (cached?.options().length) {
      this.poll = cached;
      this.setCurrent(cached);
    } else {
      this.loading = true;
    }

    app.store.find<PollModel>('polls', id).then((poll) => {
      this.poll = poll;
      this.loading = false;
      this.setCurrent(poll);
      m.redraw();
    });
  }

  setCurrent(poll: PollModel): void {
    app.current.set('poll', poll);
    app.setTitle(poll.question());
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
    return <PollsIndexSidebar />;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.poll) {
      items.add('poll', <PollView poll={this.poll} />);
    }

    return items;
  }
}
