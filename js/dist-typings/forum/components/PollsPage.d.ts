import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import { AbstractPollPage } from './AbstractPollPage';
type PollStatus = 'all' | 'published' | 'draft';
export default class PollsPage extends AbstractPollPage {
    defaultSort?: string;
    status: PollStatus;
    oninit(vnode: Mithril.Vnode): void;
    setStatus(status: PollStatus): void;
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
export {};
