/// <reference types="mithril" />
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollListState from '../../states/PollListState';
export interface PollListAttrs extends ComponentAttrs {
    state: PollListState;
}
/**
 * The `PollList` component displays a list of polls.
 */
export default class PollList extends Component<PollListAttrs> {
    view(): JSX.Element;
}
