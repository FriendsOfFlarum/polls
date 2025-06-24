import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';
import classList from 'flarum/common/utils/classList';
import Dropdown from 'flarum/common/components/Dropdown';
import Link from 'flarum/common/components/Link';
import icon from 'flarum/common/helpers/icon';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import Poll from '../../models/Poll';
import PollControls from '../../utils/PollControls';
import ItemList from 'flarum/common/utils/ItemList';
import listItems from 'flarum/common/helpers/listItems';
import PollViewPage from '../PollViewPage';

export interface IPollCompactListItemAttrs extends ComponentAttrs {
  poll: Poll;
  controls?: boolean;
}

/**
 * The `PollCompactListItem` component shows a single poll in a compact format
 * with controls but without voting functionality.
 */
export default class PollCompactListItem extends Component<IPollCompactListItemAttrs> {
  /**
   * Ensures that the poll will not be redrawn
   * unless new data comes in.
   */
  subtree!: SubtreeRetainer;
  poll!: Poll;

  oninit(vnode: Mithril.Vnode<IPollCompactListItemAttrs, this>) {
    super.oninit(vnode);

    this.poll = this.attrs.poll;

    this.subtree = new SubtreeRetainer(
      () => this.poll.freshness,
      () => this.active()
    );
  }

  view() {
    const showControls = this.attrs.controls !== false;
    const controls = showControls ? PollControls.controls(this.poll, this).toArray() : [];

    return (
      <div className="PollCompactListItem">
        <div className="PollCompactListItem-main">
          <div className="PollCompactListItem-content">
            <div className="PollCompactListItem-header">
              <Link href={app.route('fof.polls.view', { id: this.poll.id() })} className="PollCompactListItem-title">
                <h4>{this.poll.question()}</h4>
              </Link>
              {showControls && !!controls.length && (
                <Dropdown
                  icon="fas fa-ellipsis-v"
                  className="PollCompactListItem-controls"
                  menuClassName="Dropdown-menu--right"
                  buttonClassName="Button Button--icon Button--flat Button--compact"
                  accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
                >
                  {controls}
                </Dropdown>
              )}
            </div>

            {this.poll.subtitle() && <div className="PollCompactListItem-subtitle helpText">{this.poll.subtitle()}</div>}

            <ul className="PollCompactListItem-info">{listItems(this.infoItems().toArray())}</ul>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Determine whether or not the poll is currently being viewed.
   */
  active() {
    return app.current.matches(PollViewPage, { poll: this.poll });
  }

  infoItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const active = !this.poll.hasEnded();
    const activeView = this.poll.endDate()
      ? [
        icon('fas fa-clock'),
        ' ',
        active
          ? app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(this.poll.endDate()).fromNow() })
          : app.translator.trans('fof-polls.forum.poll_ended'),
      ]
      : [icon('fas fa-infinity'), ' ', app.translator.trans('fof-polls.forum.poll_never_ends')];

    items.add('active', <span className={classList('PollCompactListItem-endStatus', { active })}>{activeView}</span>, 100);

    const voteCount = this.poll.voteCount();
    if (voteCount !== undefined) {
      items.add(
        'voteCount',
        <span>
          {icon('fas fa-poll fa-fw')}
          {[
            ' ',
            app.translator.trans('fof-polls.forum.polls_count', {
              count: abbreviateNumber(voteCount),
            }),
          ]}
        </span>,
        90
      );
    }

    return items;
  }
}
