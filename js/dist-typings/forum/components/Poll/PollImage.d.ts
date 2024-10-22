import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from 'src/forum/models/Poll';
import ItemList from 'flarum/common/utils/ItemList';
interface PollImageAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class PollImage extends Component<PollImageAttrs> {
    imageUrl: string | null;
    imageAlt: string | null;
    oninit(vnode: Mithril.Vnode<PollImageAttrs, this>): void;
    view(): Mithril.Children;
    imageItems(): ItemList<Mithril.Children>;
}
export {};
