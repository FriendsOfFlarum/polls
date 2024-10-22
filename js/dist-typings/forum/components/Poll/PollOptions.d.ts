import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionModel from '../../models/PollOption';
import ItemList from 'flarum/common/utils/ItemList';
import PollState from '../../states/PollState';
interface PollOptionsAttrs extends ComponentAttrs {
    options: PollOptionModel[];
    name: String;
    state: PollState;
}
export default class PollOptions extends Component<PollOptionsAttrs> {
    view(): Mithril.Children;
    pollOptions(): ItemList<Mithril.Children>;
    createOptionView(option: PollOptionModel): Mithril.Children;
}
export {};
