import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollOptionInput from './PollOptionInput';
import PollOptionModel from '../../models/PollOption';

interface PollOptionAttrs extends ComponentAttrs {
  option: PollOptionModel;
  onchange: (e: Event) => void;
}

export default class PollOption extends Component<PollOptionAttrs> {
  view(): Mithril.Children {
    const option = this.attrs.option;
    return (
      <label className="PollOption-tmp">
        <PollOptionInput id={option.id()} isResult={false} name="vote" value="Vote for this option" onchange={this.attrs.onchange} />
        <span className="PollOption-information">
          <PollOptionLabel id={option.id()} text={option.answer()} />
        </span>
      </label>
    );
  }
}
