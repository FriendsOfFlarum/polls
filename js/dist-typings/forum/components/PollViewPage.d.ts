import type Mithril from 'mithril';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import PollModel from '../models/Poll';
export default class PollViewPage extends Page<IPageAttrs> {
    loading: boolean;
    poll: PollModel | null | undefined;
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
}
