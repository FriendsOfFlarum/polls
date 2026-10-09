import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';
export interface IPollOptionAttrs extends ComponentAttrs {
    option: PollOptionModel;
    name: string;
    state: PollState;
}
export default class PollOption<CustomAttrs extends IPollOptionAttrs = IPollOptionAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
    barItems(): ItemList<Mithril.Children>;
    textItems(): ItemList<Mithril.Children>;
    percent(): number;
    width(): number;
}
