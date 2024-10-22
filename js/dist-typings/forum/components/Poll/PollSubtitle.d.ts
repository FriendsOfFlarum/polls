import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from 'src/forum/models/Poll';
import Mithril from 'mithril';
export interface PollSubtitleAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollSubtitle extends Component<PollSubtitleAttrs> {
    view(): JSX.Element | undefined;
    pollSubtitleItems(): ItemList<Mithril.Children>;
}
