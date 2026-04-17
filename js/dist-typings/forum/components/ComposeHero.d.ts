import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Model from 'flarum/common/Model';
export interface ComposeHeroAttrs extends ComponentAttrs {
    item: Model;
    translationPrefix: string;
    className: string;
    managerRoute: string;
    managerIcon: string;
    managerLabel: Mithril.Children;
    viewRoute?: string;
    viewIcon?: string;
    viewLabel?: Mithril.Children;
}
export default class ComposeHero extends Component<ComposeHeroAttrs> {
    view(): Mithril.Children;
    controlItems(): ItemList<Mithril.Children>;
}
