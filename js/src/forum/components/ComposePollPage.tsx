import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../models/Poll';
import PollForm from './Poll/PollForm';
import PollFormState from '../states/PollFormState';
import ComposeHero from './ComposeHero';
import PollsIndexSidebar from './PollsIndexSidebar';

export default class ComposePollPage extends Page {
  poll: Poll | null | undefined = null;
  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled') || !app.forum.attribute<boolean>('canStartGlobalPolls')) {
      m.route.set('/');
      return;
    }

    this.bodyClass = 'App--compose-poll';

    const editId = m.route.param('id');
    const pollPromise = editId ? this.loadEditingPoll(editId) : Promise.resolve(PollFormState.createNewPoll());

    pollPromise.then((poll: Poll | null | undefined) => {
      this.poll = poll;

      if (poll?.exists && !poll.canEdit()) {
        m.route.set('/');
        return;
      }

      const titleKey = `fof-polls.forum.compose.${this.poll?.id() ? 'edit' : 'add'}_title`;
      app.history.push('compose-poll', app.translator.trans(titleKey) as string);
      app.setTitle(app.translator.trans(titleKey) as string);
      app.current.set('poll', poll);

      m.redraw();
    });
  }

  async loadEditingPoll(editId: string): Promise<Poll> {
    const cached = app.store.getById<Poll>('polls', editId);
    if (cached) return cached;

    this.loading = true;
    const poll = await app.store.find<Poll>('polls', editId);
    this.loading = false;
    return poll;
  }

  view(): Mithril.Children {
    return (
      <PageStructure className="ComposePollPage" hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)} loading={this.loading || !this.poll}>
        {this.contentItems().toArray()}
      </PageStructure>
    );
  }

  hero(): Mithril.Children {
    if (!this.poll) return null;

    return (
      <ComposeHero
        item={this.poll}
        className="ComposePollHero"
        translationPrefix="fof-polls.forum.compose"
        managerRoute="fof.polls.list"
        managerIcon="far fa-edit"
        managerLabel={app.translator.trans('fof-polls.forum.compose.polls_manager')}
        viewRoute="fof.polls.view"
        viewIcon="far fa-arrow-up-right-from-square"
        viewLabel={app.translator.trans('fof-polls.forum.compose.polls_preview')}
      />
    );
  }

  sidebar(): Mithril.Children {
    return <PollsIndexSidebar />;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.poll) {
      items.add('form', <PollForm poll={this.poll} onsubmit={this.onsubmit.bind(this)} allowDrafts={true} />);
    }

    return items;
  }

  async onsubmit(data: Object, state: PollFormState) {
    await state.save(data);
    this.poll = state.poll;

    // Per-flow success alerts and navigation are owned by the caller
    // (save draft / publish / schedule / plain save). This handler only
    // persists and keeps the page bound to the latest saved model.
  }
}
