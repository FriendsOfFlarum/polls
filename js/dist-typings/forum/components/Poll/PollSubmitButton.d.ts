import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollState from '../../states/PollState';
export interface IPollSubmitButtonAttrs extends ComponentAttrs {
    state: PollState;
}
export default class PollSubmitButton<CustomAttrs extends IPollSubmitButtonAttrs = IPollSubmitButtonAttrs> extends Component<CustomAttrs> {
    view(): Mithril.Children;
}
