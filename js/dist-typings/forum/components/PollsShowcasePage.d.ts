import { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import Mithril from 'mithril';
import PollListState from '../states/PollListState';
import { AbstractPollPage } from './AbstractPollPage';
export default class PollsShowcasePage extends AbstractPollPage {
    oninit(vnode: Mithril.Vnode<IPageAttrs, PollListState>): void;
    includeParams(): string[];
    contentItems(): ItemList<Mithril.Children>;
    sidebarItems(): ItemList<Mithril.Children>;
    newPollAction(): void;
}
