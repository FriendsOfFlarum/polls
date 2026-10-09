import type Mithril from 'mithril';
import Hero, { IHeroAttrs } from 'flarum/forum/components/Hero';
import ItemList from 'flarum/common/utils/ItemList';
import type Model from 'flarum/common/Model';
export interface IComposeHeroAttrs extends IHeroAttrs {
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
export default class ComposeHero<CustomAttrs extends IComposeHeroAttrs = IComposeHeroAttrs> extends Hero<CustomAttrs> {
    className(): string;
    bodyItems(): ItemList<Mithril.Children>;
    controlItems(): ItemList<Mithril.Children>;
}
