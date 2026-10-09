import type Mithril from 'mithril';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import PollGroup from '../models/PollGroup';
export default class PollGroupViewPage extends Page<IPageAttrs> {
    loading: boolean;
    pollGroup: PollGroup | null;
    oninit(vnode: Mithril.Vnode<IPageAttrs, this>): void;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
}
