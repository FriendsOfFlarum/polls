import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../../models/Poll';
export interface IPollShowcaseItemAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollShowcaseItem<CustomAttrs extends IPollShowcaseItemAttrs = IPollShowcaseItemAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
}
