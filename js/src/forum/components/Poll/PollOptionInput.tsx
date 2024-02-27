import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollOptionInputAttrs extends ComponentAttrs {
  id: Number;
  name: String;
  value: String;
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
