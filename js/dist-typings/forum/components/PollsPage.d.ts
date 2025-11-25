import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import { AbstractPollPage } from './AbstractPollPage';
export default class PollsPage extends AbstractPollPage {
    defaultSort?: string;
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    sidebarItems(): ItemList<Mithril.Children>;
    actionItems(): ItemList<Mithril.Children>;
    viewItems(): ItemList<Mithril.Children>;
    navItems(): ItemList<Mithril.Children>;
    /**
     * Change to create new poll page
     */
    newPollAction(): void;
}
