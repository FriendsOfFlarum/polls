import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../models/Poll';
import type Mithril from 'mithril';
import PollView from './PollView';

export interface PollShowcaseItemAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollShowcaseItem extends Component<PollShowcaseItemAttrs> {
  poll!: Poll;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.poll = this.attrs.poll;
  }

  view() {
    return (
      <div className="PollShowcase--item">
        <PollView poll={this.poll} />
      </div>
    );
  }
}
