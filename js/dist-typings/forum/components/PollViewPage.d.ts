import type Mithril from 'mithril';
import { AbstractPollPage } from './AbstractPollPage';
import ItemList from 'flarum/common/utils/ItemList';
export default class PollViewPage extends AbstractPollPage {
    oninit(vnode: Mithril.Vnode): void;
    contentItems(): ItemList<Mithril.Children>;
}
