import app from 'flarum/forum/app';
import type Mithril from 'mithril';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import ItemList from 'flarum/common/utils/ItemList';
import Tooltip, { TooltipAttrs } from 'flarum/common/components/Tooltip';
import PollOption from './PollOption';
import icon from 'flarum/common/helpers/icon';
import classList from 'flarum/common/utils/classList';

export default class PollResults extends PollOption {
  view(): Mithril.Children {
    return this.attrs.state.isCompactView ? this.createCompactView() : this.createWideView();
  }

  createWideView(): Mithril.Children {
    const option = this.attrs.option;
    let voteCount = option.voteCount();
    const canSeeVoteCount = typeof voteCount === 'number';
    const resultItems = this.createResultItems(voteCount).toArray();

    return (
      <div className="PollResult">
        {this.attrs.state.showCheckMarks && <label>{this.createInputView(true)}</label>}
        {canSeeVoteCount ? (
          <Tooltip text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: voteCount })} onremove={this.hideOptionTooltip}>
            <div className="PollResult-information">{resultItems}</div>
          </Tooltip>
        ) : (
          <div className="PollResult-information">{resultItems}</div>
        )}
      </div>
    );
  }

  createCompactView(): Mithril.Children {
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
          <span className="PollAnswer-text-answer">{option.answer()}</span>
          {voted && !state.showCheckMarks && icon('fas fa-check-circle', { className: 'PollAnswer-check' })}
          {canSeeVoteCount && <span className={classList('PollPercent', percent !== 100 && 'PollPercent--option')}>{percent}%</span>}
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

  createResultItems(voteCount: number): ItemList<Mithril.Children> {
    const state = this.attrs.state;
    const voteCountPercentage = (voteCount * 100) / state.overallVoteCount();
    const items = new ItemList<Mithril.Children>();

    items.add(
      'label',
      <div className="PollResult-row">
        {this.createLabelView()}
        <span className="PollResult-number">{abbreviateNumber(voteCountPercentage)} %</span>
      </div>
    );
    items.add(
      'progress',
      <div className="PollResult-row">
        <progress type="range" min="0" max={state.overallVoteCount()} value={voteCountPercentage} className="PollResult-bar" />
        <div class="PollResult-percentagePosition" style={{ left: `${voteCountPercentage}%` }}></div>
      </div>
    );

    return items;
  }

  createLabelView(): Mithril.Children {
    const option = this.attrs.option;
    const name = this.attrs.name;
    const id = option.id();

    return (
      <label for={`${name}-${id}`} id={`${name}-${id}-label`} className="PollOption-label">
        {option.answer()}
      </label>
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
}
