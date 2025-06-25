import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollListState from '../../states/PollListState';
import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
export interface PollListAttrs extends ComponentAttrs {
    state: PollListState;
}
export default class PollShowcase extends Component<PollListAttrs, PollListState> {
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    showcaseItems(): ItemList<Mithril.Children>;
    endedItems(): ItemList<Mithril.Children>;
}
