import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../../models/Poll';
export interface IPollImageAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollImage<CustomAttrs extends IPollImageAttrs = IPollImageAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
}
