import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroup from '../../models/PollGroup';
import Poll from '../../models/Poll';
import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
interface PollGroupListItemAttrs extends ComponentAttrs {
    pollGroup: PollGroup;
    poll: Poll;
    params?: any;
    compactView: boolean;
}
export default class PollGroupListItem extends Component<PollGroupListItemAttrs> {
    pollItems(): ItemList<Mithril.Children>;
    view(): JSX.Element;
    controlsView(controls: Mithril.ChildArray): Mithril.Children;
}
export {};
