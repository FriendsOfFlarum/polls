import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import app from 'flarum/forum/app';
import PollOptions from './Poll/PollOptions';
import PollImage from './Poll/PollImage';
import PollModel from '../models/Poll';
import PollState from '../states/PollState';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import PollControls from '../utils/PollControls';
import Dropdown from 'flarum/common/components/Dropdown';
import PollSubmitButton from './Poll/PollSubmitButton';
import { slug } from 'flarum/common/utils/string';

interface PollAttrs extends ComponentAttrs {
  poll: PollModel;
}

export default class PollView extends Component<PollAttrs, PollState> {
  state!: PollState;

  oninit(vnode: Mithril.Vnode<PollAttrs, this>) {
    super.oninit(vnode);
    this.state = new PollState(this.attrs.poll);
  }

  oncreate(vnode: Mithril.Vnode<PollAttrs, this>) {
    super.oncreate(vnode);

    this.preventClose = this.preventClose.bind(this);
    window.addEventListener('beforeunload', this.preventClose);
  }

  onremove(vnode: Mithril.Vnode<PollAttrs, this>) {
    super.onremove(vnode);

    window.removeEventListener('beforeunload', this.preventClose);
  }

  view(): Mithril.Children {
    const poll = this.attrs.poll;
    const state = this.state;
    const controls = PollControls.controls(poll, this);

    controls.add(
      'view',
      <Button onclick={state.showVoters} icon="fas fa-poll">
        {app.translator.trans('fof-polls.forum.public_poll')}
      </Button>
    );

    return (
      <div className="Poll" data-id={poll.id()}>
        {this.controlsView(controls.toArray())}
        {/* <div className="Poll-image">
          <PollImage image={poll.image()} />
        </div> */}
        <div className="Poll-wrapper">{this.createMainView().toArray()}</div>
      </div>
    );
  }

  createMainView(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    items.add('title', <h2 className="Poll-title">{poll.question()}</h2>);
    items.add('subtitle', <p className="Poll-subtitle">{poll.subtitle()}</p>);
    items.add('form', <form>{this.createFormItems().toArray()}</form>);

    return items;
  }

  createFormItems(): ItemList<Mithril.Children> {
    const state = this.state;
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;
    const infoItems = this.infoItems(poll.maxVotes());
    const questionSlug = slug(poll.question());

    items.add(
      'elements',
      <fieldset>
        <legend className="sr-only">{poll.question()}</legend>
        <PollOptions name={questionSlug} options={poll.options()} state={state} />
      </fieldset>
    );
    items.add(
      'sticky',
      <div className="Poll-sticky">
        {!infoItems.isEmpty() && <div className="helpText PollInfoText">{infoItems.toArray()}</div>}
        <PollSubmitButton state={state} />
      </div>
    );
    return items;
  }

  deletePoll(): void {
    PollControls.deleteAction(this.attrs.poll);
  }

  editPoll(): void {
    PollControls.editAction(this.attrs.poll);
  }

  controlsView(controls: Mithril.ChildArray): Mithril.Children {
    return (
      !!controls.length && (
        <Dropdown
          icon="fas fa-ellipsis-v"
          className="PollListItem-controls"
          menuClassName="Dropdown-menu--right"
          buttonClassName="Button Button--icon Button--flat"
          accessibleToggleLabel={app.translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
        >
          {controls}
        </Dropdown>
      )
    );
  }

  infoItems(maxVotes: number) {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    if (app.session.user && !poll.canVote() && !poll.hasEnded()) {
      items.add(
        'no-permission',
        <span>
          <i className="icon fas fa-times-circle fa-fw" />
          {app.translator.trans('fof-polls.forum.no_permission')}
        </span>
      );
    }

    if (poll.endDate()) {
      items.add(
        'end-date',
        <span>
          <i class="icon fas fa-clock fa-fw" />
          {poll.hasEnded()
            ? app.translator.trans('fof-polls.forum.poll_ended')
            : app.translator.trans('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() })}
        </span>
      );
    }

    if (poll.canVote()) {
      items.add(
        'max-votes',
        <span>
          <i className="icon fas fa-poll fa-fw" />
          {app.translator.trans('fof-polls.forum.max_votes_allowed', { max: maxVotes })}
        </span>
      );

      if (!poll.canChangeVote()) {
        items.add(
          'cannot-change-vote',
          <span>
            <i className={`icon fas fa-${this.state.hasVoted() ? 'times' : 'exclamation'}-circle fa-fw`} />
            {app.translator.trans('fof-polls.forum.poll.cannot_change_vote')}
          </span>
        );
      }
    }

    return items;
  }

  /**
   * Alert before navigating away using browser's 'beforeunload' event
   */
  preventClose = (e: Event): boolean | void => {
    if (this.state.hasSelectedOptions()) {
      e.preventDefault();
      return true;
    }
  };
}
