import app from 'flarum/forum/app';
import Hero, { IHeroAttrs } from 'flarum/forum/components/Hero';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export interface PollPageHeroAttrs extends IHeroAttrs {
  icon?: string;
  title?: Mithril.Children;
}

export default class PollPageHero extends Hero<PollPageHeroAttrs> {
  className(): string {
    return 'PollPageHero';
  }

  bodyItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const title = this.attrs.title || app.translator.trans('fof-polls.forum.polls_page.title');
    const icon = this.attrs.icon || 'fas fa-poll';

    items.add('title', <h2 className="Hero-title">{[<Icon name={icon} />, ' ', title]}</h2>, 100);

    return items;
  }
}
