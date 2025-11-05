import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import { AbstractPollGroupsPage } from './AbstractPollGroupsPage';
export default class PollGroupViewPage extends AbstractPollGroupsPage {
    oninit(vnode: Mithril.Vnode): void;
    contentItems(): ItemList<Mithril.Children>;
}
