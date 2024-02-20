import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollTitleAttrs extends ComponentAttrs {
  text: String;
}

export default class PollTitle extends Component<PollTitleAttrs> {
  view(): Mithril.Children {
    return <h2 className="Poll-title">{this.attrs.text}</h2>;
  }
}
