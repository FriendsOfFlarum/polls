import * as Mithril from 'mithril';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollResultsNumber from './PollResultNumber';
import PollOptionInput from './PollOptionInput';
import PollOptionModel from "../../models/PollOption";
import PollState from "../../states/PollState";
import abbreviateNumber from "flarum/common/utils/abbreviateNumber";

interface PollResultsAttrs extends ComponentAttrs {
    option: PollOptionModel;
    state: PollState;
}

export default class PollResults extends Component<PollResultsAttrs> {
  view(): Mithril.Children {
    const option = this.attrs.option;
    const state = this.attrs.state;
    let voteCount = option.voteCount();
    if(!voteCount){
        voteCount = 0;
    }
    else {
        voteCount = voteCount * 100 / state.overallVoteCount();
    }

    return (
      <label className="PollResult">
          <PollOptionInput id={option.id()} isResult={false} name="vote" value="Vote for this option" />
        <span className="PollResult-information">
          <div className="PollResult-row">
            <PollOptionLabel text={option.answer()} />
            <PollResultsNumber number={abbreviateNumber(voteCount)} />
          </div>

          <progress type="range" min="0" max={state.overallVoteCount()} value={voteCount} className="PollResult-bar" />
        </span>
      </label>
    );
  }
}
