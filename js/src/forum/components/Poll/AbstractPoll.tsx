import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Dropdown from 'flarum/common/components/Dropdown';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import listItems from 'flarum/common/helpers/listItems';
import PollModel from '../../models/Poll';
import PollState from '../../states/PollState';
import PollDraftBadges from './PollDraftBadges';
import PollImage from './PollImage';
import PollOptions from './PollOptions';
import PollSubmitButton from './PollSubmitButton';

export interface IPollAttrs extends ComponentAttrs {
  poll: PollModel;
}

export default abstract class AbstractPoll<CustomAttrs extends IPollAttrs = IPollAttrs> extends Component<CustomAttrs, PollState> {
  state!: PollState;

  abstract className(): string;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.state = this.createState();
  }

  createState(): PollState {
    return new PollState(this.attrs.poll);
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    window.addEventListener('beforeunload', this.preventClose);
  }

  onremove(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.onremove(vnode);

    window.removeEventListener('beforeunload', this.preventClose);
  }

  preventClose = (e: BeforeUnloadEvent): void => {
    if (this.state.hasSelectedOptions()) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  view(): Mithril.Children {
    const poll = this.attrs.poll;

    return (
      <div className={classList(this.className(), poll.imageUrl() && 'Poll--image')} data-id={poll.id()}>
        {this.viewItems().toArray()}
      </div>
    );
  }

  viewItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('header', <div className="Poll-header">{this.headerItems().toArray()}</div>, 100);
    items.add('content', <div className="Poll-content">{this.contentItems().toArray()}</div>, 50);
    items.add('footer', <div className="Poll-footer">{this.footerItems().toArray()}</div>, 0);

    return items;
  }

  headerItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    items.add(
      'title',
      <h3 className="Poll-title">
        {poll.question()}
        <PollDraftBadges poll={poll} />
      </h3>,
      100
    );

    if (poll.subtitle()) {
      items.add('subtitle', <p className="Poll-subtitle helpText">{poll.subtitle()}</p>, 50);
    }

    const controls = this.controlsView();

    if (controls) items.add('controls', controls, 0);

    return items;
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    if (poll.imageUrl()) {
      items.add('image', <PollImage poll={poll} />, 100);
    }

    items.add(
      'options',
      <fieldset className="Poll-optionsFieldset">
        <legend className="sr-only">{poll.question()}</legend>
        <PollOptions name={`poll${poll.id()}`} options={poll.options()} state={this.state} />
      </fieldset>,
      50
    );

    return items;
  }

  footerItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const infoItems = this.infoItems();

    if (!infoItems.isEmpty()) {
      items.add('info', <ul className="PollInfoText helpText">{listItems(infoItems.toArray())}</ul>, 100);
    }

    if (this.state.showButton()) {
      items.add('submit', <PollSubmitButton state={this.state} />, 0);
    }

    return items;
  }

  controlsView(): Mithril.Children {
    const controls = this.controlItems().toArray();

    if (!controls.length) return null;

    return (
      <Dropdown
        icon="fas fa-ellipsis-v"
        className="Poll-controls"
        menuClassName="Dropdown-menu--right"
        buttonClassName="Button Button--icon Button--flat"
        accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
      >
        {controls}
      </Dropdown>
    );
  }

  abstract controlItems(): ItemList<Mithril.Children>;

  infoItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;
    const state = this.state;

    if (app.session.user && !poll.canVote() && !poll.hasEnded()) {
      items.add('no-permission', this.info('fas fa-times-circle', app.translator.trans('fof-polls.forum.no_permission')), 100);
    }

    if (poll.endDate()) {
      items.add(
        'end-date',
        this.info(
          'fas fa-clock',
          poll.hasEnded()
            ? app.translator.trans('fof-polls.forum.poll_ended')
            : app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() })
        ),
        90
      );
    }

    if (poll.canVote() && !poll.hasEnded() && !state.hasVoted()) {
      items.add('max-votes', this.info('fas fa-poll', app.translator.trans('fof-polls.forum.max_votes_allowed', { max: state.getMaxVotes() })), 80);

      if (!poll.canChangeVote()) {
        items.add('cannot-change-vote', this.info('fas fa-exclamation-circle', app.translator.trans('fof-polls.forum.poll.cannot_change_vote')), 70);
      }
    }

    if (state.canSeeVoteCount && (poll.hasEnded() || state.hasVoted())) {
      items.add(
        'total-vote-count',
        this.info('fas fa-poll', app.translator.trans('fof-polls.forum.poll.total_votes', { count: poll.voteCount() })),
        60
      );
    }

    return items;
  }

  info(icon: string, text: Mithril.Children): Mithril.Children {
    return (
      <span>
        <Icon name={icon} className="fa-fw" />
        {text}
      </span>
    );
  }
}
