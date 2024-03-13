import app from 'flarum/forum/app';
import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';
import Tooltip, { TooltipAttrs } from 'flarum/common/components/Tooltip';
import icon from 'flarum/common/helpers/icon';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';

interface PollOptionAttrs extends ComponentAttrs {
  option: PollOptionModel;
  name: String;
  state: PollState;
}

export default class PollOption extends Component<PollOptionAttrs> {
  view(): Mithril.Children {
    const option = this.attrs.option;
    const state = this.attrs.state;
    const hasVoted = state.hasVoted();
    const totalVotes = state.overallVoteCount();
    const votes = option.voteCount();
    const voted = state.hasVotedFor(option);
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    // @ts-ignore
    const poll = state.poll;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    const canSeeVoteCount = typeof votes === 'number';
    const isDisabled = state.loadingOptions || (hasVoted && !poll.canChangeVote());
    const width = canSeeVoteCount ? percent : (Number(voted) / (poll.myVotes()?.length || 1)) * 100;

    const bar = (
      <div className="PollBar" data-selected={!!voted} style={`--poll-option-width: ${width}%`}>
        {state.showCheckMarks && (
          <label className="PollAnswer-checkbox checkbox">
            <input onchange={state.changeVote.bind(state, option)} type="checkbox" checked={voted} disabled={isDisabled} />
            <span className="checkmark" />
          </label>
        )}

        <div className="PollAnswer-text">
          {this.optionDisplayItems().toArray()}
        </div>

        {option.imageUrl() ? <img className="PollAnswer-image" src={option.imageUrl()} alt={option.answer()} /> : null}
      </div>
    );

    return (
      <div className={classList('PollOption', hasVoted && 'PollVoted', option.imageUrl() && 'PollOption-hasImage')} data-id={option.id()}>
        {canSeeVoteCount ? (
          <Tooltip text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: votes })} onremove={this.hideOptionTooltip}>
            {bar}
          </Tooltip>
        ) : (
          bar
        )}
      </div>
    );
  }

  /**
   * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
   * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
   * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
   */
  hideOptionTooltip(vnode: Mithril.Vnode<TooltipAttrs, Tooltip>) {
    vnode.attrs.tooltipVisible = false;

    // @ts-ignore
    vnode.state.updateVisibility();
  }

  optionDisplayItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const option = this.attrs.option;
    const state = this.attrs.state;
    const voted = state.hasVotedFor(option);
    const votes = option.voteCount();
    const totalVotes = state.overallVoteCount();
    const canSeeVoteCount = typeof votes === 'number';
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    items.add('answer', <span className="PollAnswer-text-answer">{option.answer()}</span>);

    voted && !state.showCheckMarks && items.add('check', icon('fas fa-check-circle', { className: 'PollAnswer-check' }));

    canSeeVoteCount && items.add('percent', <span className={classList('PollPercent', percent !== 100 && 'PollPercent--option')}>{percent}%</span>);

    return items;
  }
}
