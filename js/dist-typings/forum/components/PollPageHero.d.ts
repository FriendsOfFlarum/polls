/// <reference types="flarum/@types/translator-icu-rich" />
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
interface PollPageHeroAttrs extends ComponentAttrs {
    icon?: string;
    title?: string;
}
export default class PollPageHero extends Component<PollPageHeroAttrs> {
    oninit(vnode: Mithril.Vnode): void;
    get classNames(): string;
    get wrapperClasses(): string;
    oncreate(vnode: Mithril.Vnode): void;
    get title(): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    get icon(): string;
    view(): JSX.Element;
    items(): ItemList<unknown>;
}
export {};
