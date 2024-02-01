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
          <div className="PollResults-row">
            <PollOptionLabel text="Poll Option Label" />
            <PollResultsNumber number={64} />
          </div>

          <input type="range" min="0" max="100" value="64" step="1" className="PollResult-input" />
        </span>
      </label>
    );
  }
}
