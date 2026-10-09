import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollGroup from '../../models/PollGroup';
export interface IPollGroupListItemAttrs extends ComponentAttrs {
    pollGroup: PollGroup;
    compactView?: boolean;
}
export default class PollGroupListItem<CustomAttrs extends IPollGroupListItemAttrs = IPollGroupListItemAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
    mainItems(): ItemList<Mithril.Children>;
    pollItems(): ItemList<Mithril.Children>;
    controlsView(): Mithril.Children;
}
