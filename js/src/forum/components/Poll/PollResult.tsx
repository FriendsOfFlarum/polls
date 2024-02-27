import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollResultsNumber from './PollResultNumber';
import PollOptionInput from './PollOptionInput';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';

interface PollResultsAttrs extends ComponentAttrs {
  option: PollOptionModel;
  name: String;
  state: PollState;
}

export default class PollResults extends Component<PollResultsAttrs> {
  view(): Mithril.Children {
    const option = this.attrs.option;
    const state = this.attrs.state;
    let voteCount = option.voteCount();
    if (!voteCount) {
      voteCount = 0;
    } else {
      voteCount = (voteCount * 100) / state.overallVoteCount();
    }

    return (
      <label className="PollResult">
        <PollOptionInput id={option.id()} isResult={false} name={this.attrs.name} value={option.answer()} />
        <span className="PollResult-information">
          <div className="PollResult-row">
            <PollOptionLabel id={option.id()} name={this.attrs.name} text={option.answer()} />
            <PollResultsNumber number={abbreviateNumber(voteCount)} />
          </div>

          <progress type="range" min="0" max={state.overallVoteCount()} value={voteCount} className="PollResult-bar" />
          <div class="PollResult-percentagePosition" style={{ left: `${voteCount}%` }}></div>
        </span>
      </label>
    );
  }
}
