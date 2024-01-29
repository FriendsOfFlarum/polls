import * as Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollOptionDescriptionAttrs extends ComponentAttrs {
  text: String;
}

export default class PollOptionDescription extends Component<PollOptionDescriptionAttrs> {
  view(): Mithril.Children {
    return (
      <span id="privacy-setting-1-description" className="PollOption-description">
        {this.attrs.text}
      </span>
    );
  }
}
