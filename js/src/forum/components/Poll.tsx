import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import app from 'flarum/forum/app';
import PollTitle from './Poll/PollTitle';
import PollOptions from './Poll/PollOptions';
import PollImage from './Poll/PollImage';
import PollDescription from './Poll/PollDescription';
import PollModel from '../models/Poll';
import PollState from '../states/PollState';
import Tooltip from 'flarum/common/components/Tooltip';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import { slug } from '../../common';
import PollControls from '../utils/PollControls';
import Dropdown from 'flarum/common/components/Dropdown';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.poll`;

interface PollAttrs extends ComponentAttrs {
  poll: PollModel;
}

export default class Poll extends Component<PollAttrs, PollState> {
  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
    this.state = new PollState(this.attrs.poll);
  }

  view(): Mithril.Children {
    const poll = this.attrs.poll;
    const infoItems = this.infoItems(poll.maxVotes());
    const state = this.state;
    const controls = PollControls.controls(poll, this);

    controls.add('view', (<Button onclick={state.showVoters} icon="fas fa-poll">{t('fof-polls.forum.public_poll')}</Button>));


    return (
      <div className="Poll" data-id={poll.id()}>
        {this.controlsView(controls.toArray())}
        <div className="Poll-image">
          <PollImage image={poll.image} />
        </div>
        <div className="Poll-wrapper">
          <PollTitle text={poll.question()} />
          <PollDescription text="Ihre Meinung ist uns wichtig! Welche SBB-Entscheidungen möchten Sie mehr einbezogen sehen? Teilen Sie uns mit, welche Themen für Sie besonders relevant sind. Vielen Dank für Ihre Teilnahme!" />
          <form>
            <fieldset>
              <legend className="sr-only">Antworten</legend>
              <PollOptions options={poll.options()} state={state} />
            </fieldset>
            <div className="Poll-sticky">
              {!infoItems.isEmpty() && <div className="helpText PollInfoText">{infoItems.toArray()}</div>}

              {state.showButton() && (
                <Button className="Button Button--primary Poll-submit" loading={state.loadingOptions} onclick={state.onsubmit.bind(this)}>
                  {t('fof-polls.forum.poll.submit_button')}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
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
          accessibleToggleLabel={t('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')}
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
          {t('fof-polls.forum.no_permission')}
        </span>
      );
    }

    if (poll.endDate()) {
      items.add(
        'end-date',
        <span>
          <i class="icon fas fa-clock fa-fw" />
          {poll.hasEnded() ? t('fof-polls.forum.poll_ended') : t('fof-polls.forum.days_remaining', { time: dayjs(poll.endDate()).fromNow() })}
        </span>
      );
    }

    if (poll.canVote()) {
      items.add(
        'max-votes',
        <span>
          <i className="icon fas fa-poll fa-fw" />
          {t('fof-polls.forum.max_votes_allowed', { max: maxVotes })}
        </span>
      );

      if (!poll.canChangeVote()) {
        items.add(
          'cannot-change-vote',
          <span>
            <i className={`icon fas fa-${this.state.hasVoted() ? 'times' : 'exclamation'}-circle fa-fw`} />
            {t('fof-polls.forum.poll.cannot_change_vote')}
          </span>
        );
      }
    }

    return items;
  }
}
