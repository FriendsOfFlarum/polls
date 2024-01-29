import * as Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollDescriptionAttrs extends ComponentAttrs {
  text: String;
}

export default class PollDescription extends Component<PollDescriptionAttrs> {
  view(): Mithril.Children {
    return <p className="PollOption-description">{this.attrs.text}</p>;
  }
}
