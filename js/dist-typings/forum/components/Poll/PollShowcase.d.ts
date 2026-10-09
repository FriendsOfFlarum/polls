import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollListState from '../../states/PollListState';
export interface IPollShowcaseAttrs extends ComponentAttrs {
    activeState: PollListState;
    endedState: PollListState;
}
export default class PollShowcase<CustomAttrs extends IPollShowcaseAttrs = IPollShowcaseAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
    section(name: 'active' | 'ended', state: PollListState, loadMore: boolean): Mithril.Children;
    pollItems(name: string, state: PollListState): ItemList<Mithril.Children>;
}
