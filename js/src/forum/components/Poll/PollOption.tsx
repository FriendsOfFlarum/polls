import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollOptionDescription from './PollOptionDescription';
import PollOptionInput from './PollOptionInput';

export default class PollOption extends Component {
  view(): Mithril.Children {
    return (
      <label className="PollOption-tmp">
        <PollOptionInput id={1} isResult={false} name="privacy-setting" value="Private to Project Members Nice" />
        <span className="PollOption-information">
          <PollOptionLabel text="Poll Option Label" />
          <PollOptionDescription text="Poll Option Description" />
        </span>
      </label>
    );
  }
}
