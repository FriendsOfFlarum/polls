import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollListItem from './PollListItem';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import classList from 'flarum/common/utils/classList';
import PollListState from '../../states/PollListState';

export interface PollListAttrs extends ComponentAttrs {
  state: PollListState;
}

/**
 * The `PollList` component displays a list of polls.
 */
export default class PollList extends Component<PollListAttrs> {
  view() {
    const state = this.attrs.state;
    const params = state.getParams();
    const isLoading = state.isInitialLoading() || state.isLoadingNext();

    let loading;

    if (isLoading) {
      loading = <LoadingIndicator />;
    } else if (state.hasNext()) {
      loading = (
        <Button className="Button" onclick={state.loadNext.bind(state)}>
          {app.translator.trans('fof-polls.forum.polls_list.load_more_button')}
        </Button>
      );
    }

    if (state.isEmpty()) {
      const text = app.translator.trans('fof-polls.forum.polls_list.empty_text');
      return (
        <div className="PollList">
          <Placeholder text={text} />
        </div>
      );
    }

    return (
      <div className={classList('PollList', { 'PollList--searchResults': state.isSearchResults() })}>
        <ul aria-busy={isLoading} className="PollList-polls">
          {state.getPages().map((pg) => {
            return pg.items.map((poll) => (
              <li key={poll.id()} data-id={poll.id()}>
                <PollListItem poll={poll} params={params} />
              </li>
            ));
          })}
        </ul>
        <div className="PollList-loadMore">{loading}</div>
      </div>
    );
  }
}
