import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Model from 'flarum/common/Model';
import AbstractPollListState from '../../states/AbstractPollListState';
import Poll from '../../models/Poll';
export interface IPollListAttrs<M extends Model = Poll> extends ComponentAttrs {
    state: AbstractPollListState<M>;
}
export default class PollList<M extends Model = Poll, CustomAttrs extends IPollListAttrs<M> = IPollListAttrs<M>> extends Component<CustomAttrs> {
    className(): string;
    itemView(item: M): Mithril.Children;
    emptyText(): Mithril.Children;
    loadMoreText(): Mithril.Children;
    view(): Mithril.Children;
    loadMoreView(): Mithril.Children;
}
