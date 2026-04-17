import Page, { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import PollGroup from '../models/PollGroup';
export default class PollGroupViewPage extends Page<IPageAttrs> {
    loading: boolean;
    pollGroup: PollGroup | null;
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
}
