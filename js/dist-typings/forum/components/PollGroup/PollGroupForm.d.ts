import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import PollGroupModel from '../../models/PollGroup';
import PollGroupFormState from '../../states/PollGroupFormState';
export interface IPollGroupFormAttrs extends ComponentAttrs {
    pollGroup: PollGroupModel;
    onsubmit: (data: object, state: PollGroupFormState) => Promise<void>;
}
export default class PollGroupForm extends Component<IPollGroupFormAttrs, PollGroupFormState> {
    protected name: Stream<string>;
    oninit(vnode: Mithril.Vnode<IPollGroupFormAttrs, this>): void;
    view(): Mithril.Children;
    fields(): ItemList<Mithril.Children>;
    submitItems(): ItemList<Mithril.Children>;
    pollItems(): ItemList<Mithril.Children>;
    data(): object;
    onsubmit(event: Event): Promise<void>;
}
