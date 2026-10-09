import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../../models/Poll';
export interface IPollDraftBadgesAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollDraftBadges<CustomAttrs extends IPollDraftBadgesAttrs = IPollDraftBadgesAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
    items(): ItemList<Mithril.Children>;
    scheduleError(): Mithril.Children;
}
