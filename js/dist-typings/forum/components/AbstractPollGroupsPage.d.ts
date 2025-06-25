import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PollGroupListState from '../states/PollGroupListState';
import PollGroup from '../models/PollGroup';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export declare abstract class AbstractPollGroupsPage extends Page<IPageAttrs, PollGroupListState> {
    loading: boolean;
    pollGroup: PollGroup | null;
    pollGroups: PollGroup[];
    view(): Mithril.Children;
    pageContent(): ItemList<Mithril.Children>;
    mainContent(): ItemList<Mithril.Children>;
    content(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    sidebarItems(): ItemList<Mithril.Children>;
    navItems(): ItemList<Mithril.Children>;
    newPollGroupAction(): void;
}
