import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';

interface PollOptionAttrs extends ComponentAttrs {
  option: PollOptionModel;
  name: String;
  state: PollState;
}

export default class PollOption extends Component<PollOptionAttrs> {
  view(): Mithril.Children {
    return (
      <label className="PollOption">
        {this.createInputView(false)}
        <span className="PollOption-information">{this.createLabelView()}</span>
      </label>
    );
  }

  createInputView(isResult: boolean): Mithril.Children {
    const option = this.attrs.option;
    const name = this.attrs.name;
    const id = option.id();
    const state = this.attrs.state;

    return (
      <input
        type="radio"
        name={name}
        value={option.answer()}
        style={{ opacity: isResult ? 0 : 1 }}
        className="PollOption-input"
        aria-labelledby={`${name}-${id}-label`}
        aria-describedby={`${name}-${id}-description`}
        onchange={state.changeVote.bind(state, option)}
        id={`${name}-${id}`}
      />
    );
  }

  createLabelView(): Mithril.Children {
    const option = this.attrs.option;
    const name = this.attrs.name;
    const id = option.id();

    return (
      <span id={`${name}-${id}-label`} className="PollOption-label">
        {option.answer()}
      </span>
    );
  }
}
