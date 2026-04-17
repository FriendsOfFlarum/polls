import Hero, { IHeroAttrs } from 'flarum/forum/components/Hero';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export interface PollPageHeroAttrs extends IHeroAttrs {
    icon?: string;
    title?: Mithril.Children;
}
export default class PollPageHero extends Hero<PollPageHeroAttrs> {
    className(): string;
    bodyItems(): ItemList<Mithril.Children>;
}
