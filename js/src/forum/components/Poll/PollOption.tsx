import app from 'flarum/forum/app';
import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';
import Tooltip, { TooltipAttrs } from 'flarum/common/components/Tooltip';
import icon from 'flarum/common/helpers/icon';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../../models/Poll';

interface PollOptionAttrs extends ComponentAttrs {
  option: PollOptionModel;
  name: string;
  state: PollState;
}

export default class PollOption extends Component<PollOptionAttrs, PollState> {
  option!: PollOptionModel;
  name!: string;
  state!: PollState;
  hasVoted: boolean = false;
  totalVotes: number = 0;
  votes: number = 0;
  voted: boolean = false;
  poll!: Poll;
  canSeeVoteCount: boolean = false;
  answer!: string;

  oninit(vnode: Mithril.Vnode<PollOptionAttrs, PollState>) {
    super.oninit(vnode);
    this.option = this.attrs.option;
    this.name = this.attrs.name;
    this.state = this.attrs.state;
    this.poll = this.state.poll;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    this.canSeeVoteCount = typeof this.votes === 'number';

    this.answer = this.option.answer();
  }

  percent(): number {
    return this.totalVotes > 0 ? Math.round((this.votes / this.totalVotes) * 100) : 0;
  }

  view(): Mithril.Children {
    // following values can be changed by ui interactions, so we need to update them on every render
    this.hasVoted = this.state.hasVoted();
    this.totalVotes = this.state.overallVoteCount();
    this.votes = this.option.voteCount();
    this.voted = this.state.hasVotedFor(this.option);

    const isDisabled = this.state.loadingOptions || (this.hasVoted && !this.poll.canChangeVote());
    const width = this.canSeeVoteCount ? this.percent() : (Number(this.voted) / (this.poll.myVotes()?.length || 1)) * 100;

    const bar = (
      <label className="PollBar" data-selected={!!this.voted} style={`--poll-option-width: ${width}%`}>
        {this.state.showCheckMarks && (
          <div className="PollAnswer-checkbox">
            <input
              className="PollAnswer-input sr-only"
              type="checkbox"
              id={this.option.id()}
              name={this.name}
              value={this.answer}
              checked={this.voted}
              disabled={isDisabled}
              aria-labelledby={`${this.name}-${this.option.id()}-label`}
              onchange={this.state.changeVote.bind(this.state, this.option)}
            />
            <span className="checkmark" />
          </div>
        )}

        <div className="PollAnswer-text">{this.optionDisplayItems().toArray()}</div>

        {this.option.imageUrl() ? <img className="PollAnswer-image" src={this.option.imageUrl()} alt={this.option.answer()} /> : null}
      </label>
    );

    return (
      <div
        className={classList('PollOption', this.hasVoted && 'PollVoted', this.option.imageUrl() && 'PollOption-hasImage')}
        data-id={this.option.id()}
      >
        {this.canSeeVoteCount ? (
          <Tooltip text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: this.votes })} onremove={this.hideOptionTooltip}>
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

    items.add(
      'answer',
      <span className="PollAnswer-text-answer" id={`${this.name}-${this.option.id()}-label`}>
        {this.answer}
      </span>
    );

    this.voted && !this.state.showCheckMarks && items.add('check', icon('fas fa-check-circle', { className: 'PollAnswer-check' }));

    this.canSeeVoteCount &&
      items.add('percent', <span className={classList('PollPercent', this.percent() !== 100 && 'PollPercent--option')}>{this.percent()}%</span>);

    return items;
  }
}
