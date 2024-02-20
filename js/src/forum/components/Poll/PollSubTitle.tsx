import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollSubTitleAttrs extends ComponentAttrs {
  text: String;
}

export default class PollSubTitle extends Component<PollSubTitleAttrs> {
  view(): Mithril.Children {
    return <p className="Poll-subtitle">{this.attrs.text}</p>;
  }
}
