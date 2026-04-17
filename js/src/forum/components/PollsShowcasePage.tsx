import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';
import PollListState from '../states/PollListState';
import PollShowcase from './Poll/PollShowcase';
import PollPageHero from './PollPageHero';

export default class PollsShowcasePage extends Page<IPageAttrs, PollListState> {
  state!: PollListState;
  endedState!: PollListState;

  oninit(vnode: Mithril.Vnode<IPageAttrs, PollListState>) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    this.state = new PollListState({
      sort: m.route.param('sort'),
      filter: { '-isEnded': '1' },
      include: this.includeParams(),
    });

    this.endedState = new PollListState({
      sort: m.route.param('sort'),
      filter: { isEnded: '1' },
      include: this.includeParams(),
    });

    this.state.refresh();
    this.endedState.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  includeParams(): string[] {
    return ['options', 'votes', 'myVotes', 'myVotes.option'];
  }

  view(): Mithril.Children {
    return (
      <PageStructure className="PollsShowcasePage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)} loading={!this.state}>
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

    items.add('poll-showcase', <PollShowcase activeState={this.state} endedState={this.endedState} />);

    return items;
  }

  newPollAction(): void {
    if (!app.session.user) {
      app.modal.show(() => import('flarum/forum/components/LogInModal'));
      return;
    }

    m.route.set(app.route('fof.polls.composer'));
  }
}
