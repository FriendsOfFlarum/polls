import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollModel from '../../models/Poll';
import PollState from '../../states/PollState';
export interface IPollAttrs extends ComponentAttrs {
    poll: PollModel;
}
export default abstract class AbstractPoll<CustomAttrs extends IPollAttrs = IPollAttrs> extends Component<CustomAttrs, PollState> {
    state: PollState;
    abstract className(): string;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    createState(): PollState;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    onremove(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    preventClose: (e: BeforeUnloadEvent) => void;
    view(): Mithril.Children;
    viewItems(): ItemList<Mithril.Children>;
    headerItems(): ItemList<Mithril.Children>;
    contentItems(): ItemList<Mithril.Children>;
    footerItems(): ItemList<Mithril.Children>;
    controlsView(): Mithril.Children;
    abstract controlItems(): ItemList<Mithril.Children>;
    infoItems(): ItemList<Mithril.Children>;
    info(icon: string, text: Mithril.Children): Mithril.Children;
}
