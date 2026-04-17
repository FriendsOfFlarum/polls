import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import PollGroupListState from '../states/PollGroupListState';
export default class PollGroupListPage extends Page<IPageAttrs, PollGroupListState> {
    state: PollGroupListState;
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
}
