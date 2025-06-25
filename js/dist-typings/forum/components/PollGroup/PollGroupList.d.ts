/// <reference types="mithril" />
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroupListState from '../../states/PollGroupListState';
export interface PollGroupListAttrs extends ComponentAttrs {
    state: PollGroupListState;
}
/**
 * The `PollGroupList` component displays a list of poll groups.
 */
export default class PollGroupList extends Component<PollGroupListAttrs> {
    view(): JSX.Element;
}
