import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroup from '../models/PollGroup';
import ItemList from 'flarum/common/utils/ItemList';
export interface ComposePollGroupHeroAttrs extends ComponentAttrs {
    pollGroup: PollGroup;
}
export default class ComposePollGroupHero extends Component<ComposePollGroupHeroAttrs> {
    pollGroup: PollGroup;
    oninit(vnode: Mithril.Vnode<ComposePollGroupHeroAttrs>): void;
    view(): Mithril.Children;
    controlItems(): ItemList<Mithril.Children>;
}
