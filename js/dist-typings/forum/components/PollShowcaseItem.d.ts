import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../models/Poll';
import type Mithril from 'mithril';
export interface PollShowcaseItemAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollShowcaseItem extends Component<PollShowcaseItemAttrs> {
    poll: Poll;
    oninit(vnode: Mithril.Vnode): void;
    view(): JSX.Element;
}
