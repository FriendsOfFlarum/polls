import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import PollListState from '../states/PollListState';
export default class PollsShowcasePage extends Page<IPageAttrs, PollListState> {
    state: PollListState;
    endedState: PollListState;
    oninit(vnode: Mithril.Vnode<IPageAttrs, PollListState>): void;
    includeParams(): string[];
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    newPollAction(): void;
}
