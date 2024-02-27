import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import PollModel from '../models/Poll';
import extractText from 'flarum/common/utils/extractText';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollView from './PollView';

export default class PollViewPage extends Page {
  poll: PollModel | null | undefined = null;
  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    const editId = m.route.param('id');
    this.poll = app.store.getById<PollModel>('poll', editId);

    if (!this.poll) {
      this.loading = true;

      app.store.find<PollModel>('fof/polls', editId).then((item) => {
        this.poll = item;
        this.loading = false;
        app.setTitle(this.poll.question());
        m.redraw();
      });
    }
  }

  view(): Mithril.Children {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="PollsPage">
        <div className="container">
          <PollView poll={this.poll} />
        </div>
      </div>
    );
  }
}
