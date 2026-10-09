import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';
export interface IPollOptionsAttrs extends ComponentAttrs {
    options: PollOptionModel[];
    name: string;
    state: PollState;
}
export default class PollOptions<CustomAttrs extends IPollOptionsAttrs = IPollOptionsAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
    pollOptions(): ItemList<Mithril.Children>;
    createOptionView(option: PollOptionModel): Mithril.Children;
}
