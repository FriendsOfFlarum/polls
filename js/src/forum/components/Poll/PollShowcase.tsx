import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import ItemList from 'flarum/common/utils/ItemList';
import PollListState from '../../states/PollListState';
import PollShowcaseItem from './PollShowcaseItem';

const EMPTY_KEY = { active: 'no-active-polls', ended: 'no-recent-polls' } as const;

export interface IPollShowcaseAttrs extends ComponentAttrs {
  activeState: PollListState;
  endedState: PollListState;
}

export default class PollShowcase<CustomAttrs extends IPollShowcaseAttrs = IPollShowcaseAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    return (
      <div className="PollShowcase">
        {this.section('active', this.attrs.activeState, false)}
        {this.section('ended', this.attrs.endedState, true)}
      </div>
    );
  }

  section(name: 'active' | 'ended', state: PollListState, loadMore: boolean): Mithril.Children {
    const items = this.pollItems(name, state).toArray();

    return (
      <div className={`PollShowcase-section PollShowcase-section--${name}`}>
        <h2 className="PollShowcase-title">{app.translator.trans(`fof-polls.forum.showcase.${name}-polls`)}</h2>
        {items.length ? items : <Placeholder text={app.translator.trans(`fof-polls.forum.showcase.${EMPTY_KEY[name]}`)} />}
        {loadMore && state.hasNext() && (
          <Button className="Button" loading={state.isLoadingNext()} onclick={() => state.loadNext()}>
            {app.translator.trans('fof-polls.forum.polls_list.load_more_button')}
          </Button>
        )}
      </div>
    );
  }

  pollItems(name: string, state: PollListState): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (state.isLoading()) {
      items.add('loading', <LoadingIndicator size="large" />);

      return items;
    }

    state.getPages().forEach((page) => {
      page.items.forEach((poll) => {
        items.add(`poll-${name}-${poll.id()}`, <PollShowcaseItem key={poll.id()} poll={poll} />);
      });
    });

    return items;
  }
}
