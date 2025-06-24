import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroup from '../../models/PollGroup';
import classList from 'flarum/common/utils/classList';
import app from 'flarum/forum/app';
import PollListState from '../../states/PollListState';
import PollListItem from '../Poll/PollListItem';
import Button from 'flarum/common/components/LinkButton';
import LogInModal from 'flarum/forum/components/LogInModal';
import Mithril from 'mithril';
import Dropdown from 'flarum/common/components/Dropdown';
import PollGroupControls from '../../utils/PollGroupControls';

interface PollGroupListItemAttrs extends ComponentAttrs {
  pollGroup: PollGroup;
  params?: any;
}

export default class PollGroupListItem extends Component<PollGroupListItemAttrs, PollListState> {
  oninit(vnode: any) {
    super.oninit(vnode);

    this.state = new PollListState({
      filter: {
        pollGroup: this.attrs.pollGroup.id(),
      },
    });
  }

  view() {
    const pollGroup = this.attrs.pollGroup;
    // @ts-expect-error
    const controls = PollGroupControls.controls(pollGroup, this);

    return (
      <div className={classList('PollGroupListItem', 'PollGroupListItem--pollgroup')}>
        <div className="PollGroupListItem-main">
          <h3 className="PollGroupListItem-title">{pollGroup.name()}</h3>
          {this.controlsView(controls.toArray())}
        </div>

        <ul className="PollGroupListItem-polls">
          {this.state.getPages().length > 0 ? (
            this.state.getPages().map((pg) => {
              return pg.items.map((poll) => (
                <li key={poll.id()} data-id={poll.id()}>
                  <PollListItem poll={poll} params={{}} />
                </li>
              ));
            })
          ) : (
            <span>{app.translator.trans('fof-polls.forum.poll_groups.list_page.no_polls')}</span>
          )}
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
