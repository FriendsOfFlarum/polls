import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import classList from 'flarum/common/utils/classList';
import Model from 'flarum/common/Model';
import AbstractPollListState from '../../states/AbstractPollListState';
import Poll from '../../models/Poll';
import PollListItem from './PollListItem';

export interface IPollListAttrs<M extends Model = Poll> extends ComponentAttrs {
  state: AbstractPollListState<M>;
}

export default class PollList<M extends Model = Poll, CustomAttrs extends IPollListAttrs<M> = IPollListAttrs<M>> extends Component<CustomAttrs> {
  className(): string {
    return 'PollList';
  }

  itemView(item: M): Mithril.Children {
    return <PollListItem poll={item as unknown as Poll} />;
  }

  emptyText(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.polls_list.empty_text');
  }

  loadMoreText(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.polls_list.load_more_button');
  }

  view(): Mithril.Children {
    const state = this.attrs.state;
    const className = this.className();

    if (state.isEmpty()) {
      return (
        <div className={className}>
          <Placeholder text={this.emptyText()} />
        </div>
      );
    }

    const isLoading = state.isInitialLoading() || state.isLoadingNext();
    const items = state.getPages().flatMap((page) => page.items);

    return (
      <div className={classList(className, state.isSearchResults() && `${className}--searchResults`)}>
        <ul role="feed" aria-busy={isLoading} className={`${className}-items`}>
          {items.map((item, index) => (
            <li key={item.id()} data-id={item.id()} role="article" aria-setsize={-1} aria-posinset={index + 1}>
              {this.itemView(item)}
            </li>
          ))}
        </ul>
        <div className={`${className}-loadMore`}>{this.loadMoreView()}</div>
      </div>
    );
  }

  loadMoreView(): Mithril.Children {
    const state = this.attrs.state;

    if (state.isInitialLoading() || state.isLoadingNext()) {
      return <LoadingIndicator />;
    }

    if (!state.hasNext()) return null;

    return (
      <Button className="Button" onclick={() => state.loadNext()}>
        {this.loadMoreText()}
      </Button>
    );
  }
}
