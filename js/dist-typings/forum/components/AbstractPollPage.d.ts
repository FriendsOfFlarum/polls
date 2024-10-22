import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PollListState from '../states/PollListState';
import Poll from '../models/Poll';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export declare abstract class AbstractPollPage extends Page<IPageAttrs, PollListState> {
    loading: boolean;
    poll: Poll | null | undefined;
    polls: Poll[];
    view(): Mithril.Children;
    pageContent(): ItemList<Mithril.Children>;
    mainContent(): ItemList<Mithril.Children>;
    content(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    sidebarItems(): ItemList<Mithril.Children>;
    navItems(): ItemList<Mithril.Children>;
}
