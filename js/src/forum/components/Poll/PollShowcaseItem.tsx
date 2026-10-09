import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../../models/Poll';
import PollView from '../PollView';

export interface IPollShowcaseItemAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollShowcaseItem<CustomAttrs extends IPollShowcaseItemAttrs = IPollShowcaseItemAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    return (
      <div className="PollShowcase-item">
        <PollView poll={this.attrs.poll} />
      </div>
    );
  }
}
