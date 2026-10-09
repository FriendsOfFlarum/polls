import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../../models/Poll';
export interface IPollListItemAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollListItem<CustomAttrs extends IPollListItemAttrs = IPollListItemAttrs> extends Component<CustomAttrs> {
    subtree: SubtreeRetainer;
    poll: Poll;
    highlightRegExp?: RegExp;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): boolean;
    elementAttrs(): Record<string, unknown>;
    view(): Mithril.Children;
    viewItems(): ItemList<Mithril.Children>;
    controlsView(): Mithril.Children;
    slidableUnderneathView(): Mithril.Children;
    mainView(): Mithril.Children;
    active(): boolean;
    markAsRead(): void;
    infoItems(): ItemList<Mithril.Children>;
}
