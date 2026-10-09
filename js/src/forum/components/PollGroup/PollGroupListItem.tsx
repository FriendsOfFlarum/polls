import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Dropdown from 'flarum/common/components/Dropdown';
import Placeholder from 'flarum/common/components/Placeholder';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../../models/Poll';
import PollGroup from '../../models/PollGroup';
import PollGroupControls from '../../utils/PollGroupControls';
import PollListItem from '../Poll/PollListItem';
import PollShowcaseItem from '../Poll/PollShowcaseItem';

export interface IPollGroupListItemAttrs extends ComponentAttrs {
  pollGroup: PollGroup;
  compactView?: boolean;
}

export default class PollGroupListItem<CustomAttrs extends IPollGroupListItemAttrs = IPollGroupListItemAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    const polls = this.pollItems().toArray();

    return (
      <div className="PollGroupListItem">
        <div className="PollGroupListItem-main">{this.mainItems().toArray()}</div>
        {polls.length ? (
          <ul className="PollGroupListItem-polls">{polls}</ul>
        ) : (
          <Placeholder text={app.translator.trans('fof-polls.forum.poll_groups.list_page.no_polls')} />
        )}
      </div>
    );
  }

  mainItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('title', <h3 className="PollGroupListItem-title">{this.attrs.pollGroup.name()}</h3>, 100);
    const controls = this.controlsView();

    if (controls) items.add('controls', controls, 0);

    return items;
  }

  pollItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const polls = this.attrs.pollGroup.polls() as (Poll | undefined)[];

    polls?.forEach((poll) => {
      if (!poll) return;

      items.add(
        `poll-${poll.id()}`,
        <li key={poll.id()} className="PollGroupListItem-poll">
          {this.attrs.compactView ? <PollListItem poll={poll} /> : <PollShowcaseItem poll={poll} />}
        </li>
      );
    });

    return items;
  }

  controlsView(): Mithril.Children {
    const controls = PollGroupControls.controls(this.attrs.pollGroup, this).toArray();

    if (!controls.length) return null;

    return (
      <Dropdown
        icon="fas fa-ellipsis-v"
        className="PollGroupListItem-controls"
        menuClassName="Dropdown-menu--right"
        buttonClassName="Button Button--icon Button--flat"
        accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
      >
        {controls}
      </Dropdown>
    );
  }
}
