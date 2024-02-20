import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import type { PollListParams } from '../../states/PollListState';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';
import classList from 'flarum/common/utils/classList';
import Dropdown from 'flarum/common/components/Dropdown';
import Link from 'flarum/common/components/Link';
import highlight from 'flarum/common/helpers/highlight';
import slidable from 'flarum/forum/utils/slidable';
import icon from 'flarum/common/helpers/icon';
import PollPage from './PollPage';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import Poll from '../../models/Poll';
import PollControls from '../../utils/PollControls';
import { slug } from '../../../common';
import ItemList from 'flarum/common/utils/ItemList';
import listItems from 'flarum/common/helpers/listItems';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.list`;

export interface IPollListItemAttrs extends ComponentAttrs {
  poll: Poll;
  params: PollListParams;
}

/**
 * The `PollListItem` component shows a single poll in the
 * poll list.
 */
export default class PollListItem<CustomAttrs extends IPollListItemAttrs = IPollListItemAttrs> extends Component<CustomAttrs> {
  /**
   * Ensures that the poll will not be redrawn
   * unless new data comes in.
   */
  subtree!: SubtreeRetainer;

  highlightRegExp?: RegExp;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.subtree = new SubtreeRetainer(
      () => this.attrs.poll.freshness,
      () => {
        const time = app.session.user && app.session.user.markedAllAsReadAt();
        return time && time.getTime();
      },
      () => this.active()
    );
  }

  elementAttrs() {
    return {
      className: classList('PollListItem', {
        active: this.active(),
        'PollListItem--hidden': this.attrs.poll.isHidden(),
        Slidable: 'ontouchstart' in window,
      }),
    };
  }

  view() {
    const poll = this.attrs.poll;

    const controls = PollControls.controls(poll, this).toArray();
    const attrs = this.elementAttrs();

    return (
      <div {...attrs}>
        {this.controlsView(controls)}
        {this.contentView()}
        {this.slidableUnderneathView()}
      </div>
    );
  }

  controlsView(controls: Mithril.ChildArray): Mithril.Children {
    return (
      !!controls.length && (
        <Dropdown
          icon="fas fa-ellipsis-v"
          className="UserCard-controls PollListItem-controls"
          menuClassName="Dropdown-menu--right"
          buttonClassName="Button Button--icon Button--flat"
          accessibleToggleLabel={t('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
        >
          {controls}
        </Dropdown>
      )
    );
  }

  slidableUnderneathView(): Mithril.Children {
    const poll = this.attrs.poll;
    const isUnread = poll.isUnread();

    return (
      <span
        className={classList('Slidable-underneath Slidable-underneath--left Slidable-underneath--elastic', { disabled: !isUnread })}
        onclick={this.markAsRead.bind(this)}
      >
        {icon('fas fa-check')}
      </span>
    );
  }

  contentView(): Mithril.Children {
    const poll = this.attrs.poll;
    // const isUnread = poll.isUnread();
    // const isRead = poll.isRead();

    return (
      //   <div className={classList('PollListItem-content', 'Slidable-content', { unread: isUnread, read: isRead })}>
      <div className={classList('PollListItem-content')}>
        {this.mainView()}
        {this.infoView()}
      </div>
    );
  }

  mainView(): Mithril.Children {
    const poll = this.attrs.poll;

    return (
      <Link href={app.route('fof_polls_list', { id: poll.id() })} className="PollListItem-main">
        <h2 className="PollListItem-title">{highlight(poll.question(), this.highlightRegExp)}</h2>
      </Link>
    );
  }

  infoView() {
    return <ul className="UserCard-info">{listItems(this.infoItems().toArray())}</ul>;
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    // If we're on a touch device, set up the discussion row to be slidable.
    // This allows the user to drag the row to either side of the screen to
    // reveal controls.
    if ('ontouchstart' in window) {
      const slidableInstance = slidable(this.element);

      this.$('.PollListItem-controls').on('hidden.bs.dropdown', () => slidableInstance.reset());
    }
  }

  onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.onbeforeupdate(vnode);

    return this.subtree.needsRebuild();
  }

  /**
   * Determine whether or not the discussion is currently being viewed.
   */
  active() {
    return app.current.matches(PollPage, { poll: this.attrs.poll });
  }

  /**
   * Mark the poll as read.
   */
  markAsRead() {
    const poll = this.attrs.poll;

    if (poll.isUnread()) {
      poll.save({ lastVotedNumber: poll.voteCount() });
      m.redraw();
    }
  }

  infoItems(): ItemList<Mithril.Children> {
    const poll = this.attrs.poll;
    const items = new ItemList<Mithril.Children>();
    const active = !poll.hasEnded();
    const activeView = poll.endDate()
      ? [
          icon('fas fa-clock'),
          ' ',
          active ? t('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() }) : t('fof-polls.forum.poll_ended'),
        ]
      : [icon('fas fa-om'), ' ', t('fof-polls.forum.poll_never_ends')];

    items.add('active', <span className={classList('UserCard-lastSeen', { active })}>{activeView}</span>);

    const voteCount = poll.voteCount();
    if (voteCount !== undefined) {
      items.add(
        'discussion-count',
        <div className="userStat">
          {icon('fas fa-poll fa-fw')}
          {[
            ' ',
            t('fof-polls.forum.polls_count', {
              count: abbreviateNumber(voteCount),
            }),
          ]}
        </div>,
        70
      );
    }

    return items;
  }
}
