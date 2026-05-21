import type Mithril from 'mithril';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import PollListState from '../states/PollListState';
type PollStatus = 'all' | 'published' | 'draft';
export default class PollsPage extends Page<IPageAttrs, PollListState> {
    state: PollListState;
    status: PollStatus;
    oninit(vnode: Mithril.Vnode): void;
    setStatus(status: PollStatus): void;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    toolbarItems(): ItemList<Mithril.Children>;
    viewItems(): ItemList<Mithril.Children>;
    actionItems(): ItemList<Mithril.Children>;
}
export {};
