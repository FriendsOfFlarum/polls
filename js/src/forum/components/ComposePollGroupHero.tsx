import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import PollGroup from '../models/PollGroup';
import ItemList from 'flarum/common/utils/ItemList';

export interface ComposePollGroupHeroAttrs extends ComponentAttrs {
  pollGroup: PollGroup;
}

export default class ComposePollGroupHero extends Component<ComposePollGroupHeroAttrs> {
  pollGroup!: PollGroup;

  oninit(vnode: Mithril.Vnode<ComposePollGroupHeroAttrs>): void {
    super.oninit(vnode);
    this.pollGroup = this.attrs.pollGroup;
  }

  view(): Mithril.Children {
    return (
      <div className="ComposePollGroupHero Hero">
        <div className="container">
          <div className="containerNarrow">
            <h2 className="Hero-title">
              {app.translator.trans(`fof-polls.forum.poll_groups.composer.${!!this.pollGroup.id() ? 'edit' : 'add'}_title`)}
            </h2>
            <div className="ComposePollGroupHero-controls">{this.controlItems().toArray()}</div>
          </div>
        </div>
      </div>
    );
  }

  controlItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'groups',
      <LinkButton
        icon="fas fa-layer-group"
        className="Button Button--secondary PollGroupListLink"
        itemClassName="App-primaryControl"
        href={app.route('fof.polls.groups.list')}
      >
        {app.translator.trans('fof-polls.forum.poll_groups.composer.groups_manager')}
      </LinkButton>
    );

    if (this.pollGroup.exists) {
      items.add(
        'view',
        <LinkButton
          icon="far fa-arrow-up-right-from-square"
          className="Button Button--secondary PollGroupPreviewLink"
          itemClassName="App-primaryControl"
          href={app.route('fof.polls.groups.view', { id: this.pollGroup.id() })}
        >
          {app.translator.trans('fof-polls.forum.poll_groups.composer.view_group')}
        </LinkButton>
      );
    }

    return items;
  }
}
