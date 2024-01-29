import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollOptionDescription from './PollOptionDescription';

export default class PollOption extends Component {
  view(): Mithril.Children {
    return (
      <label className="PollOption-tmp">
        <input
          type="radio"
          name="privacy-setting"
          value="Private to Project Members"
          className="PollOption-input"
          aria-labelledby="privacy-setting-1-label"
          aria-describedby="privacy-setting-1-description"
        />
        <span className="PollOption-information">
          <PollOptionLabel text="Poll Option Label" />
          <PollOptionDescription text="Poll Option Description" />
        </span>
      </label>
    );
  }
}
