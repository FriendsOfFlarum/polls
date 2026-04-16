import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
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
  view(): Mithril.Children {
    const { item, translationPrefix, className } = this.attrs;
    const isEditing = !!item.id();

    return (
      <div className={`${className} Hero`}>
        <div className="container">
          <div className="containerNarrow">
            <h2 className="Hero-title">{app.translator.trans(`${translationPrefix}.${isEditing ? 'edit' : 'add'}_title`)}</h2>
            <div className={`${className}-controls`}>{this.controlItems().toArray()}</div>
          </div>
        </div>
      </div>
    );
  }

  controlItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { item, managerRoute, managerIcon, managerLabel, viewRoute, viewIcon, viewLabel } = this.attrs;

    items.add(
      'manager',
      <LinkButton icon={managerIcon} className="Button Button--secondary" itemClassName="App-primaryControl" href={app.route(managerRoute)}>
        {managerLabel}
      </LinkButton>
    );

    if (item.exists && viewRoute && viewLabel) {
      items.add(
        'view',
        <LinkButton
          icon={viewIcon || 'far fa-arrow-up-right-from-square'}
          className="Button Button--secondary"
          itemClassName="App-primaryControl"
          href={app.route(viewRoute, { id: item.id() })}
        >
          {viewLabel}
        </LinkButton>
      );
    }

    return items;
  }
}
