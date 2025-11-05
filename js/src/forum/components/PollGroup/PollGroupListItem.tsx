import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroup from '../../models/PollGroup';
import Poll from '../../models/Poll';
import classList from 'flarum/common/utils/classList';
import app from 'flarum/forum/app';
import PollListItem from '../Poll/PollListItem';
import Mithril from 'mithril';
import Dropdown from 'flarum/common/components/Dropdown';
import PollGroupControls from '../../utils/PollGroupControls';
import ItemList from 'flarum/common/utils/ItemList';
import PollShowcaseItem from '../Poll/PollShowcaseItem';
// import PollGroupListState from 'src/forum/states/PollGroupListState';

interface PollGroupListItemAttrs extends ComponentAttrs {
  pollGroup: PollGroup;
  poll: Poll;
  params?: any;
  compactView: boolean;
  // state: PollGroupListState;
}

export default class PollGroupListItem extends Component<PollGroupListItemAttrs> {
  pollItems(): ItemList<Mithril.Children> {
    const polls = this.attrs.pollGroup.polls();
    const items = new ItemList<Mithril.Children>();

    if (!polls || polls.length === 0) {
      return items;
    }

    polls.forEach((poll: Poll | undefined): void => {
      if (poll) {
        items.add(
          'poll-' + poll.id(),
          <li key={poll.id()} className="PollGroup-poll">
            {!this.attrs.compactView ? <PollShowcaseItem poll={poll} /> : <PollListItem poll={poll} />}
          </li>
        );
      }
    });

    return items;
  }

  mainItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const pollGroup = this.attrs.pollGroup;

    items.add('title', <h3 className="PollGroupListItem-title">{pollGroup.name()}</h3>);
    items.add('controls', this.controlsView(PollGroupControls.controls(pollGroup, this).toArray()));

    return items;
  }

  view() {
    const polls = this.pollItems().toArray();

    return (
      <div className={classList('PollGroupListItem', 'PollGroupListItem--pollgroup')}>
        <div className="PollGroupListItem-main">{this.mainItems().toArray()}</div>

        <ul className="PollGroupListItem-polls">
          {polls.length > 0 ? polls : <span>{app.translator.trans('fof-polls.forum.poll_groups.list_page.no_polls')}</span>}
        </ul>
      </div>
    );
  }

  controlsView(controls: Mithril.ChildArray): Mithril.Children {
    return (
      !!controls.length && (
        <Dropdown
          icon="fas fa-ellipsis-v"
          className="PollGroupListItem-controls"
          menuClassName="Dropdown-menu--right"
          buttonClassName="Button Button--icon Button--flat"
          accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
        >
          {controls}
        </Dropdown>
      )
    );
  }
}
