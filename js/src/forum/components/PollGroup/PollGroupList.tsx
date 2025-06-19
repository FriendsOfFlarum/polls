import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroupListItem from './PollGroupListItem';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import classList from 'flarum/common/utils/classList';
import PollGroupListState from '../../states/PollGroupListState';

export interface PollGroupListAttrs extends ComponentAttrs {
  state: PollGroupListState;
}

/**
 * The `PollGroupList` component displays a list of poll groups.
 */
export default class PollGroupList extends Component<PollGroupListAttrs> {
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
          {app.translator.trans('fof-polls.forum.pollgroups_list.load_more_button')}
        </Button>
      );
    }

    if (state.isEmpty()) {
      const text = app.translator.trans('fof-polls.forum.pollgroups_list.empty_text');
      return (
        <div className="PollGroupList">
          <Placeholder text={text} />
        </div>
      );
    }

    return (
      <div className={classList('PollGroupList', { 'PollGroupList--searchResults': state.isSearchResults() })}>
        <ul aria-busy={isLoading} className="PollGroupList-pollgroups">
          {state.getPages().map((pg) => {
            return pg.items.map((pollGroup) => (
              <li key={pollGroup.id()} data-id={pollGroup.id()}>
                <PollGroupListItem pollGroup={pollGroup} params={params} />
              </li>
            ));
          })}
        </ul>
        <div className="PollGroupList-loadMore">{loading}</div>
      </div>
    );
  }
}
