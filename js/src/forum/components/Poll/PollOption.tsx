import app from 'flarum/forum/app';
import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Tooltip from 'flarum/common/components/Tooltip';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';

export interface IPollOptionAttrs extends ComponentAttrs {
  option: PollOptionModel;
  name: string;
  state: PollState;
}

export default class PollOption<CustomAttrs extends IPollOptionAttrs = IPollOptionAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    const { option, state } = this.attrs;
    const voted = state.hasVotedFor(option);

    const bar = (
      <label className="PollBar" data-selected={voted || undefined} style={`--poll-option-width: ${this.width()}%`}>
        {this.barItems().toArray()}
      </label>
    );

    const className = classList('PollOption', voted && 'PollOption--voted', option.imageUrl() && 'PollOption--hasImage');

    if (!state.canSeeVoteCount) {
      return (
        <div className={className} data-id={option.id()}>
          {bar}
        </div>
      );
    }

    return (
      <Tooltip text={app.translator.trans('fof-polls.forum.tooltip.votes', { count: option.voteCount() })}>
        <div className={className} data-id={option.id()}>
          {bar}
        </div>
      </Tooltip>
    );
  }

  barItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { option, name, state } = this.attrs;
    const multiple = state.poll.allowMultipleVotes();

    items.add(
      'input',
      <input
        className="PollOption-input"
        type={multiple ? 'checkbox' : 'radio'}
        name={name}
        value={option.id()}
        checked={state.hasVotedFor(option)}
        disabled={!state.canSelect()}
        // A selected radio fires no change event when clicked again, so the
        // click is the only signal to withdraw. A checkbox flips, so it is
        // left to change alone.
        onclick={(e: Event) => {
          if (!multiple && state.hasVotedFor(option)) state.changeVote(option, e);
        }}
        onchange={(e: Event) => state.changeVote(option, e)}
      />,
      100
    );

    items.add('text', <span className="PollOption-text">{this.textItems().toArray()}</span>, 50);

    if (option.imageUrl()) {
      items.add(
        'image',
        <img className="PollOption-image" src={option.imageUrl()} srcset={option.imageSrcset() ?? undefined} alt={option.answer()} loading="lazy" />,
        0
      );
    }

    return items;
  }

  textItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { option, state } = this.attrs;

    items.add('answer', <span className="PollOption-answer">{option.answer()}</span>, 100);

    if (state.canSeeVoteCount) {
      const percent = this.percent();

      items.add('percent', <span className={classList('PollOption-percent', percent === 100 && 'PollOption-percent--full')}>{percent}%</span>, 50);

      items.add('votes', <span className="sr-only">{app.translator.trans('fof-polls.forum.tooltip.votes', { count: option.voteCount() })}</span>, 0);
    }

    return items;
  }

  percent(): number {
    const total = this.attrs.state.overallVoteCount();

    return total > 0 ? Math.round((this.attrs.option.voteCount() / total) * 100) : 0;
  }

  // With no count to scale against, the bar just marks what the reader picked.
  width(): number {
    const state = this.attrs.state;

    if (state.canSeeVoteCount) return this.percent();

    return (Number(state.hasVotedFor(this.attrs.option)) / (state.poll.myVotes()?.length || 1)) * 100;
  }
}
