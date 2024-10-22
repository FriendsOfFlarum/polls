import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../models/Poll';
import ItemList from 'flarum/common/utils/ItemList';
export interface ComposePollHeroAttrs extends ComponentAttrs {
    poll: Poll;
}
export default class ComposePollHero extends Component<ComposePollHeroAttrs> {
    poll: Poll;
    oninit(vnode: Mithril.Vnode<ComposePollHeroAttrs>): void;
    view(): Mithril.Children;
    controlItems(): ItemList<Mithril.Children>;
}
