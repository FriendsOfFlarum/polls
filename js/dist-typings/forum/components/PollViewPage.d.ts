import type Mithril from 'mithril';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import PollModel from '../models/Poll';
export default class PollViewPage extends Page<IPageAttrs> {
    loading: boolean;
    poll: PollModel | null;
    oninit(vnode: Mithril.Vnode<IPageAttrs, this>): void;
    setCurrent(poll: PollModel): void;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
}
