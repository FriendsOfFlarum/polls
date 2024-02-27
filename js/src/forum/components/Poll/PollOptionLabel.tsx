import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollOptionLabelAttrs extends ComponentAttrs {
  id: Number;
  name: String;
  text: String;
}

export default class PollOptionLabel extends Component<PollOptionLabelAttrs> {
  view(): Mithril.Children {
    return (
      <span id={`${this.attrs.name}-${this.attrs.id}-label`} className="PollOption-label">
        {this.attrs.text}
      </span>
    );
  }
}
