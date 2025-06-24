import app from 'flarum/forum/app';
import { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import Mithril from 'mithril';
import PollListState from '../states/PollListState';
import extractText from 'flarum/common/utils/extractText';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import { AbstractPollPage } from './AbstractPollPage';
import PollShowcase from './Poll/PollShowcase';

export default class PollsShowcasePage extends AbstractPollPage {
  oninit(vnode: Mithril.Vnode<IPageAttrs, PollListState>) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      m.route.set('/');
      return;
    }

    this.state = new PollListState({
      sort: m.route.param('sort'),
      filter: m.route.param('filter'),
      include: this.includeParams(),
    });

    this.state.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  includeParams(): string[] {
    return ['options', 'votes', 'myVotes', 'myVotes.option'];
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = super.contentItems();

    if (!this.loading) {
      items.add('poll-showcase', <PollShowcase state={this.state} />);
    }

    return items;
  }

  sidebarItems(): ItemList<Mithril.Children> {
    const items = super.sidebarItems();
    const canStartPoll = app.forum.attribute<boolean>('canStartGlobalPolls');

    items.remove('newDiscussion');

    if (canStartPoll) {
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
        </Button>,
        100
      );
    }

    return items;
  }

  newPollAction(): void {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      return;
    }

    m.route.set(app.route('fof.polls.compose'));
  }
}
