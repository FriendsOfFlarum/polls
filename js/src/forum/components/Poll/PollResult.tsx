import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollResultsNumber from './PollResultNumber';
import PollOptionInput from './PollOptionInput';

export default class PollResults extends Component {
  view(): Mithril.Children {
    return (
      <label className="PollResult">
        <PollOptionInput id={1} isResult={true} name="privacy-setting" value="Private to Project Members Nice" />
        <span className="PollResult-information">
          <div className="PollResult-row">
            <PollOptionLabel text="Poll Option Label" />
            <PollResultsNumber number={64} />
          </div>

          <progress type="range" min="0" max="100" value="64" className="PollResult-bar" />
        </span>
      </label>
    );
  }
}
