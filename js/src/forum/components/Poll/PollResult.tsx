import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';

export default class PollResults extends Component {
  view(): Mithril.Children {
    return (
      <label className="PollResult">
        <input
          type="radio"
          name="privacy-setting"
          value="Private to Project Members"
          className="PollOption-input"
          style="opacity: 0;"
          aria-labelledby="privacy-setting-1-label"
          aria-describedby="privacy-setting-1-description"
        />
        <span className="PollResult-information">
          <div className="PollResults-row">
            <PollOptionLabel text="Poll Option Label" />
            <span className="PollResult-number">76 %</span>
          </div>

          <input type="range" min="0" max="100" value="76" step="1" className="PollResult-input" />
        </span>
      </label>
    );
  }
}
