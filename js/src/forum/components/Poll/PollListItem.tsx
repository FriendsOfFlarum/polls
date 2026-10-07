import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import Icon from 'flarum/common/components/Icon';
import Link from 'flarum/common/components/Link';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';
import ItemList from 'flarum/common/utils/ItemList';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import highlight from 'flarum/common/helpers/highlight';
import listItems from 'flarum/common/helpers/listItems';
import slidable from 'flarum/forum/utils/slidable';
import Poll from '../../models/Poll';
import PollControls from '../../utils/PollControls';
import PollViewPage from '../PollViewPage';
import PollDraftBadges from './PollDraftBadges';

export interface IPollListItemAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollListItem<CustomAttrs extends IPollListItemAttrs = IPollListItemAttrs> extends Component<CustomAttrs> {
  subtree!: SubtreeRetainer;
  poll!: Poll;
  highlightRegExp?: RegExp;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.poll = this.attrs.poll;

    this.subtree = new SubtreeRetainer(
      () => this.poll.freshness,
      () => {
        const time = app.session.user && app.session.user.markedAllAsReadAt();
        return time && time.getTime();
      },
      () => this.active()
    );
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    if ('ontouchstart' in window) {
      const slidableInstance = slidable(this.element);

      this.$('.PollListItem-controls').on('hidden.bs.dropdown', () => slidableInstance.reset());
    }
  }

  onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.onbeforeupdate(vnode);

    return this.subtree.needsRebuild();
  }

  elementAttrs(): Record<string, unknown> {
    return {
      className: classList('PollListItem', {
        active: this.active(),
        'PollListItem--hidden': this.poll.isHidden(),
        Slidable: 'ontouchstart' in window,
      }),
    };
  }

  view(): Mithril.Children {
    return <div {...this.elementAttrs()}>{this.viewItems().toArray()}</div>;
  }

  viewItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    const controls = this.controlsView();

    if (controls) items.add('controls', controls, 100);
    items.add('content', <div className="PollListItem-content Slidable-content">{this.mainView()}</div>, 50);
    items.add('slidableUnderneath', this.slidableUnderneathView(), 0);

    return items;
  }

  controlsView(): Mithril.Children {
    const controls = PollControls.controls(this.poll, this).toArray();

    if (!controls.length) return null;

    return (
      <Dropdown
        icon="fas fa-ellipsis-v"
        className="PollListItem-controls"
        menuClassName="Dropdown-menu--right"
        buttonClassName="Button Button--icon Button--flat"
        accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
      >
        {controls}
      </Dropdown>
    );
  }

  slidableUnderneathView(): Mithril.Children {
    const isUnread = this.poll.isUnread();

    return (
      <Button
        className={classList('Slidable-underneath Slidable-underneath--left Slidable-underneath--elastic', { disabled: !isUnread })}
        icon="fas fa-check"
        disabled={!isUnread}
        aria-label={extractText(app.translator.trans('core.forum.notifications.mark_as_read_tooltip'))}
        onclick={this.markAsRead.bind(this)}
      />
    );
  }

  mainView(): Mithril.Children {
    return (
      <Link href={app.route('fof.polls.view', { id: this.poll.id() })} className="PollListItem-main">
        <h2 className="PollListItem-title">
          {highlight(this.poll.question(), this.highlightRegExp)}
          <PollDraftBadges poll={this.poll} />
        </h2>
        {this.poll.subtitle() && <p className="PollListItem-subtitle helpText">{this.poll.subtitle()}</p>}
        <ul className="PollListItem-info">{listItems(this.infoItems().toArray())}</ul>
      </Link>
    );
  }

  active(): boolean {
    return app.current.matches(PollViewPage, { poll: this.poll });
  }

  markAsRead(): void {
    if (!this.poll.isUnread()) return;

    this.poll.save({ lastVotedNumber: this.poll.voteCount() });
    m.redraw();
  }

  infoItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.poll;
    const active = !poll.hasEnded();

    items.add(
      'active',
      <span className={classList('PollListItem-endStatus', { active })}>
        <Icon name={poll.endDate() ? 'fas fa-clock' : 'fas fa-infinity'} />{' '}
        {!poll.endDate()
          ? app.translator.trans('fof-polls.forum.poll_never_ends')
          : active
            ? app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() })
            : app.translator.trans('fof-polls.forum.poll_ended')}
      </span>,
      100
    );

    const voteCount = poll.voteCount();

    if (voteCount !== undefined) {
      items.add(
        'voteCount',
        <span>
          <Icon name="fas fa-poll" className="fa-fw" /> {app.translator.trans('fof-polls.forum.polls_count', { count: abbreviateNumber(voteCount) })}
        </span>,
        70
      );
    }

    return items;
  }
}
