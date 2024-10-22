import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from 'src/forum/models/Poll';
import Mithril from 'mithril';
export interface PollTitleAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollTitle extends Component<PollTitleAttrs> {
    view(): JSX.Element;
    pollTitleItems(): ItemList<Mithril.Children>;
}
