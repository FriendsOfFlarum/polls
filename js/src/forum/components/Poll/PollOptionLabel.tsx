import * as Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollOptionLabelAttrs extends ComponentAttrs {
  text: String;
}

export default class PollOptionLabel extends Component<PollOptionLabelAttrs> {
  view(): Mithril.Children {
    return (
      <span id="privacy-setting-1-label" className="PollOption-label">
        {this.attrs.text}
      </span>
    );
  }
}
