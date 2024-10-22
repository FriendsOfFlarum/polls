import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollState from '../../states/PollState';
interface PollSubmitButtonAttrs extends ComponentAttrs {
    state: PollState;
}
export default class PollSubmitButton extends Component<PollSubmitButtonAttrs> {
    view(): Mithril.Children;
    /**
     * Event handler for submit button being clicked
     */
    pollButtonSubmit(state: PollState, event: Event): void;
}
export {};
