import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollListState from '../../states/PollListState';
import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import PollShowcaseItem from './PollShowcaseItem';
import Placeholder from 'flarum/common/components/Placeholder';
import app from 'flarum/forum/app';

export interface PollListAttrs extends ComponentAttrs {
  state: PollListState;
}

export default class PollShowcase extends Component<PollListAttrs, PollListState> {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.attrs.state.refresh();
  }

  view(): Mithril.Children {
    return (
      <div className="PollShowcase">
        <div className="PollShowcase--active">
          <h2 className="PollShowcase-title PollShowcase-title--active">{app.translator.trans('fof-polls.forum.showcase.active-polls')}</h2>
          {this.showcaseItems().toArray()}
          {this.showcaseItems().toArray().length === 0 && <Placeholder text={app.translator.trans('fof-polls.forum.showcase.no-active-polls')} />}
        </div>
        <div className="PollShowcase--ended">
          <h2 className="PollShowcase-title PollShowcase-title--ended">{app.translator.trans('fof-polls.forum.showcase.ended-polls')}</h2>
          {this.endedItems().toArray()}
          {this.endedItems().toArray().length === 0 && <Placeholder text={app.translator.trans('fof-polls.forum.showcase.no-recent-polls')} />}
        </div>
      </div>
    );
  }

  showcaseItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    this.attrs.state.getPages().map((page) => {
      page.items.map((poll) => {
        if (!poll.hasEnded()) {
          items.add('poll-active-' + poll.id(), <PollShowcaseItem poll={poll} />);
        }
      });
    });

    return items;
  }

  endedItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    this.attrs.state.getPages().map((page) => {
      page.items.map((poll) => {
        if (poll.hasEnded()) {
          items.add('poll-ended-' + poll.id(), <PollShowcaseItem poll={poll} />);
        }
      });
    });

    return items;
  }
}
