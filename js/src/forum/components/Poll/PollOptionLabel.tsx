import * as Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollOptionLabelAttrs extends ComponentAttrs {
  text: String;
  id: Number;
}

export default class PollOptionLabel extends Component<PollOptionLabelAttrs> {
  view(): Mithril.Children {
    return (
      <span id={`vote_${this.attrs.id}_label`} className="PollOption-label">
        {this.attrs.text}
      </span>
    );
  }
}
