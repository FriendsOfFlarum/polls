import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import PollGroupModel from '../../models/PollGroup';
import PollGroupFormState from '../../states/PollGroupFormState';
interface PollGroupFormAttrs extends ComponentAttrs {
    pollGroup: PollGroupModel;
    onsubmit: (data: object, state: PollGroupFormState) => Promise<void>;
}
export default class PollGroupForm extends Component<PollGroupFormAttrs, PollGroupFormState> {
    protected name: Stream<string>;
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    fields(): ItemList<Mithril.Children>;
    pollItems(): ItemList<Mithril.Children>;
    data(): object;
    onsubmit(event: Event): Promise<void>;
    delete(): Promise<void>;
}
export {};
