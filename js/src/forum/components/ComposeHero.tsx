import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Hero, { IHeroAttrs } from 'flarum/forum/components/Hero';
import LinkButton from 'flarum/common/components/LinkButton';
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
  className(): string {
    return this.attrs.className;
  }

  bodyItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { item, translationPrefix } = this.attrs;

    items.add('title', <h2 className="Hero-title">{app.translator.trans(`${translationPrefix}.${item.id() ? 'edit' : 'add'}_title`)}</h2>, 100);

    items.add('controls', <div className="ComposeHero-controls">{this.controlItems().toArray()}</div>, 0);

    return items;
  }

  controlItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { item, managerRoute, managerIcon, managerLabel, viewRoute, viewIcon, viewLabel } = this.attrs;

    items.add(
      'manager',
      <LinkButton icon={managerIcon} className="Button Button--secondary" href={app.route(managerRoute)}>
        {managerLabel}
      </LinkButton>,
      100
    );

    if (item.exists && viewRoute && viewLabel) {
      items.add(
        'view',
        <LinkButton
          icon={viewIcon || 'far fa-arrow-up-right-from-square'}
          className="Button Button--secondary"
          href={app.route(viewRoute, { id: item.id() })}
        >
          {viewLabel}
        </LinkButton>,
        50
      );
    }

    return items;
  }
}
