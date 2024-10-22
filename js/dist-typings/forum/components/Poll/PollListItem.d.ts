import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import type { PollListParams } from '../../states/PollListState';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';
import Poll from '../../models/Poll';
import ItemList from 'flarum/common/utils/ItemList';
export interface IPollListItemAttrs extends ComponentAttrs {
    poll: Poll;
    params: PollListParams;
}
/**
 * The `PollListItem` component shows a single poll in the
 * poll list.
 */
export default class PollListItem<CustomAttrs extends IPollListItemAttrs = IPollListItemAttrs> extends Component<CustomAttrs> {
    /**
     * Ensures that the poll will not be redrawn
     * unless new data comes in.
     */
    subtree: SubtreeRetainer;
    poll: Poll;
    highlightRegExp?: RegExp;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    elementAttrs(): {
        className: any;
    };
    view(): JSX.Element;
    controlsView(controls: Mithril.ChildArray): Mithril.Children;
    slidableUnderneathView(): Mithril.Children;
    contentView(): Mithril.Children;
    mainView(): Mithril.Children;
    /**
     * Allow extensions to revise the question string.
     */
    pollQuestion(poll: Poll): string;
    /**
     * Allow extensions to revise the subtitle string.
     */
    pollSubtitle(poll: Poll): string | null;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): boolean;
    /**
     * Determine whether or not the discussion is currently being viewed.
     */
    active(): boolean;
    /**
     * Mark the poll as read.
     */
    markAsRead(): void;
    infoItems(): ItemList<Mithril.Children>;
}
