import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollResultsNumberAttrs extends ComponentAttrs {
  number: Number;
}

export default class PollResultsNumber extends Component<PollResultsNumberAttrs> {
  view(): Mithril.Children {
    return <span className="PollResult-number">{this.attrs.number} %</span>;
  }
}
