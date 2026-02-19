import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollListState from '../../states/PollListState';
import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import PollShowcaseItem from './PollShowcaseItem';
import Placeholder from 'flarum/common/components/Placeholder';
import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';

export interface PollListAttrs extends ComponentAttrs {
  activeState: PollListState;
  endedState: PollListState;
}

export default class PollShowcase extends Component<PollListAttrs, PollListState> {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);
    // States are already refreshed by PollsShowcasePage.
  }

  view(): Mithril.Children {
    const activeItems = this.showcaseItems();
    const endedItems = this.endedItems();

    return (
      <div className="PollShowcase">
        <div className="PollShowcase--active">
          <h2 className="PollShowcase-title PollShowcase-title--active">{app.translator.trans('fof-polls.forum.showcase.active-polls')}</h2>
          {activeItems.toArray()}
          {!this.attrs.activeState.isLoading() && activeItems.toArray().length === 0 && (
            <Placeholder text={app.translator.trans('fof-polls.forum.showcase.no-active-polls')} />
          )}
        </div>
        <div className="PollShowcase--ended">
          <h2 className="PollShowcase-title PollShowcase-title--ended">{app.translator.trans('fof-polls.forum.showcase.ended-polls')}</h2>
          {endedItems.toArray()}
          {!this.attrs.endedState.isLoading() && endedItems.toArray().length === 0 && (
            <Placeholder text={app.translator.trans('fof-polls.forum.showcase.no-recent-polls')} />
          )}
          {this.attrs.endedState.hasNext() && (
            <Button className="Button" loading={this.attrs.endedState.isLoadingNext()} onclick={() => this.attrs.endedState.loadNext()}>
              {app.translator.trans('core.forum.discussion_list.load_more_button')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  showcaseItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.attrs.activeState.isLoading()) {
      items.add('loading', <LoadingIndicator size="large" />);
      return items;
    }

    this.attrs.activeState.getPages().forEach((page) => {
      page.items.forEach((poll) => {
        items.add('poll-active-' + poll.id(), <PollShowcaseItem poll={poll} />);
      });
    });

    return items;
  }

  endedItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.attrs.endedState.isLoading()) {
      items.add('loading', <LoadingIndicator size="large" />);
      return items;
    }

    this.attrs.endedState.getPages().forEach((page) => {
      page.items.forEach((poll) => {
        items.add('poll-ended-' + poll.id(), <PollShowcaseItem poll={poll} />);
      });
    });

    return items;
  }
}
