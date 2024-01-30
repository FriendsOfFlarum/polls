import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Poll from '../../../common/models/Poll';
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

    // TODO IMPLEMENT POLLCONTROLS
    //const controls = PollControls.controls(poll, this).toArray();
    const attrs = this.elementAttrs();

    return (
      <div {...attrs}>
        {/* {this.controlsView(controls)} */}
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
          className="PollListItem-controls"
          buttonClassName="Button Button--icon Button--flat"
          accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
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
        {/* {this.authorAvatarView()}
        {this.badgesView()} */}
        {this.mainView()}
        {this.voteCountItem()}
      </div>
    );
  }

  mainView(): Mithril.Children {
    const poll = this.attrs.poll;

    return (
      <Link href={app.route.poll(poll)} className="PollListItem-main">
        <h2 className="PollListItem-title">{highlight(poll.title(), this.highlightRegExp)}</h2>
        {/* <ul className="PollListItem-info">{listItems(this.infoItems().toArray())}</ul> */}
      </Link>
    );
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

  voteCountItem() {
    const poll = this.attrs.poll;
    const isUnread = poll.isUnread();

    if (isUnread) {
      return (
        <button className="Button--ua-reset PollListItem-count" onclick={this.markAsRead.bind(this)}>
          <span aria-hidden="true">{abbreviateNumber(poll.voteCount())}</span>

          <span className="visually-hidden">
            {app.translator.trans('core.forum.discussion_list.unread_replies_a11y_label', { count: poll.voteCount() })}
          </span>
        </button>
      );
    }

    return (
      <span className="PollListItem-count">
        <span aria-hidden="true">{abbreviateNumber(poll.voteCount())}</span>

        <span className="visually-hidden">
          {app.translator.trans('fof-polls.forum.poll_list.total_votes_a11y_label', { count: poll.voteCount() })}
        </span>
      </span>
    );
  }
}
