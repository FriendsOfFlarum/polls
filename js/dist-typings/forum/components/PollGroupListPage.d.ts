import ItemList from 'flarum/common/utils/ItemList';
import Mithril from 'mithril';
import { AbstractPollGroupsPage } from './AbstractPollGroupsPage';
export default class PollGroupListPage extends AbstractPollGroupsPage {
    oninit(vnode: Mithril.Vnode): void;
    contentItems(): ItemList<Mithril.Children>;
}
