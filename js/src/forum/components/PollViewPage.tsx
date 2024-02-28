import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import PollModel from '../models/Poll';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollView from './PollView';
import listItems from 'flarum/common/helpers/listItems';
import { AbstractPollPage } from './AbstractPollPage';

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

  view(): Mithril.Children {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="PollsPage">
        {this.hero()}
        <div className="container">
          <div className="sideNavContainer">
            <nav className="PollsPage-nav sideNav">
              <ul>{listItems(this.sidebarItems().toArray())}</ul>
            </nav>
            <div className="PollsPage-results sideNavOffset">
              <div className="IndexPage-toolbar"></div>
              <PollView poll={this.poll} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
