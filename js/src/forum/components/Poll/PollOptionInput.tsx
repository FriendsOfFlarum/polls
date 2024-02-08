import * as Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollOptionInputAttrs extends ComponentAttrs {
  id: Number; // for example 1
  name: String; // for example privacy-setting
  value: String; // for example Private to Project Members
  isResult?: Boolean;
  onchange: (e: Event) => void;
}

export default class PollOptionInput extends Component<PollOptionInputAttrs> {
  view(): Mithril.Children {
    const { isResult } = this.attrs;
    return (
      <input
        type="radio"
        name={this.attrs.name}
        value={this.attrs.value}
        style={{ opacity: isResult ? 0 : 1 }}
        className="PollOption-input"
        aria-labelledby={`${this.attrs.name}-${this.attrs.id}-label`}
        aria-describedby={`${this.attrs.name}-${this.attrs.id}-description`}
        onchange={this.attrs.onchange}
      />
    );
  }
}
