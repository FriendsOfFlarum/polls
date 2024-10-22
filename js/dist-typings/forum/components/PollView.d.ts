import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollModel from '../models/Poll';
import PollState from '../states/PollState';
import ItemList from 'flarum/common/utils/ItemList';
interface PollAttrs extends ComponentAttrs {
    poll: PollModel;
}
export default class PollView extends Component<PollAttrs, PollState> {
    state: PollState;
    oninit(vnode: Mithril.Vnode<PollAttrs, this>): void;
    oncreate(vnode: Mithril.Vnode<PollAttrs, this>): void;
    onremove(vnode: Mithril.Vnode<PollAttrs, this>): void;
    view(): Mithril.Children;
    createMainView(): ItemList<Mithril.Children>;
    createPollHeader(): ItemList<Mithril.Children>;
    createPollContent(): ItemList<Mithril.Children>;
    createPollFooter(): ItemList<Mithril.Children>;
    createFormItems(): ItemList<Mithril.Children>;
    controlsView(controls: Mithril.ChildArray): Mithril.Children;
    infoItems(maxVotes: number): ItemList<Mithril.Children>;
    /**
     * Alert before navigating away using browser's 'beforeunload' event
     */
    preventClose: (e: Event) => boolean | void;
}
export {};
