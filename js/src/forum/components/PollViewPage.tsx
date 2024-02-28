import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import PollModel from '../models/Poll';
import PollView from './PollView';
import { AbstractPollPage } from './AbstractPollPage';
import ItemList from 'flarum/common/utils/ItemList';

export default class PollViewPage extends AbstractPollPage {
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

  contentItems(): ItemList<Mithril.Children> {
    const items = super.contentItems();

    if (!this.loading) {
      items.add('poll', <PollView poll={this.poll} />);
    }

    return items;
  }
}
