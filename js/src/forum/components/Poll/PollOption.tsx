import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollOptionInput from './PollOptionInput';
import PollOptionModel from '../../models/PollOption';

interface PollOptionAttrs extends ComponentAttrs {
  option: PollOptionModel;
  name: String;
  onchange: (e: Event) => void;
}

export default class PollOption extends Component<PollOptionAttrs> {
  view(): Mithril.Children {
    const option = this.attrs.option;
    return (
      <label className="PollOption">
        <PollOptionInput id={option.id()} isResult={false} name={this.attrs.name} value={option.answer()} onchange={this.attrs.onchange} />
        <span className="PollOption-information">
          <PollOptionLabel id={option.id()} name={this.attrs.name} text={option.answer()} />
        </span>
      </label>
    );
  }
}
