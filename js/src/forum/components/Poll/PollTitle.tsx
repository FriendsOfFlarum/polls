import * as Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollTitleAttrs extends ComponentAttrs {
  text: String;
}

export default class PollTitle extends Component<PollTitleAttrs> {
  view(): Mithril.Children {
    return <p className="Poll-title">{this.attrs.text}</p>;
  }
}
