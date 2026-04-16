import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Tooltip from 'flarum/common/components/Tooltip';
import Icon from 'flarum/common/components/Icon';
import Poll from '../models/Poll';
import type Mithril from 'mithril';
import Post from 'flarum/common/models/Post';
import extractText from 'flarum/common/utils/extractText';
import PollImage from './Poll/PollImage';
import PollOptions from './Poll/PollOptions';
import PollState from '../states/PollState';
import PollSubmitButton from './Poll/PollSubmitButton';
import { slug } from 'flarum/common/utils/string';

export interface PostPollAttrs extends ComponentAttrs {
  poll: Poll;
  post?: Post;
}

export default class PostPoll extends Component<PostPollAttrs, PollState> {
  state!: PollState;

  oninit(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    super.oninit(vnode);

    this.state = new PollState(this.attrs.poll, this.attrs.post);
  }

  oncreate(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    super.oncreate(vnode);

    this.preventClose = this.preventClose.bind(this);
    window.addEventListener('beforeunload', this.preventClose);
  }

  onremove(vnode: Mithril.Vnode<PostPollAttrs, this>) {
    super.onremove(vnode);

    window.removeEventListener('beforeunload', this.preventClose);
  }

  view() {
    const poll = this.attrs.poll;
    const state = this.state;
    const questionSlug = slug(poll.question());
    const infoItems = this.infoItems(state.getMaxVotes());

    return (
      <div className="Post-poll" data-id={poll.id()}>
        <div className="PollHeading">
          <div className="PollHeading-title-container">
            <h3 className="PollHeading-title">{poll.question()}</h3>
            {poll.subtitle() && <p className="helpText PollHeading-subtitle">{poll.subtitle()}</p>}
          </div>

          <div className="PollHeading-actions">{this.actionItems().toArray()}</div>
        </div>

        {!!poll.imageUrl() && <PollImage poll={poll} />}

        <div>
          <fieldset className="PollOptions">
            <legend className="sr-only">{poll.question()}</legend>
            <PollOptions name={questionSlug} options={poll.options()} state={state} />
          </fieldset>

          <div className="Poll-sticky">
            {!infoItems.isEmpty() && <div className="helpText PollInfoText">{infoItems.toArray()}</div>}
            {state.showButton() && <PollSubmitButton state={state} />}
          </div>
        </div>
      </div>
    );
  }

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;
    const state = this.state;

    if (poll.canSeeVoters()) {
      items.add(
        'voters',
        <Tooltip text={app.translator.trans('fof-polls.forum.public_poll')}>
          <Button className="Button PollHeading-voters" onclick={state.showVoters} icon="fas fa-poll" />
        </Tooltip>
      );
    }

    if (poll.canEdit()) {
      items.add(
        'edit',
        <Tooltip text={app.translator.trans('fof-polls.forum.moderation.edit')}>
          <Button className="Button PollHeading-edit" onclick={() => app.modal.show(() => import('./EditPollModal'), { poll })} icon="fas fa-pen" />
        </Tooltip>
      );
    }

    if (poll.canDelete()) {
      items.add(
        'delete',
        <Tooltip text={app.translator.trans('fof-polls.forum.moderation.delete')}>
          <Button className="Button PollHeading-delete" onclick={this.deletePoll.bind(this)} icon="fas fa-trash" />
        </Tooltip>
      );
    }

    return items;
  }

  infoItems(maxVotes: number): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    if (app.session.user && !poll.canVote() && !poll.hasEnded()) {
      items.add(
        'no-permission',
        <span>
          <Icon name="fas fa-times-circle" className="fa-fw" />
          {app.translator.trans('fof-polls.forum.no_permission')}
        </span>
      );
    }

    if (poll.endDate()) {
      items.add(
        'end-date',
        <span>
          <Icon name="fas fa-clock" className="fa-fw" />
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
          <Icon name="fas fa-poll" className="fa-fw" />
          {app.translator.trans('fof-polls.forum.max_votes_allowed', { max: maxVotes })}
        </span>
      );

      if (!poll.canChangeVote()) {
        items.add(
          'cannot-change-vote',
          <span>
            <Icon name={`fas fa-${this.state.hasVoted() ? 'times' : 'exclamation'}-circle`} className="fa-fw" />
            {app.translator.trans('fof-polls.forum.poll.cannot_change_vote')}
          </span>
        );
      }
    }

    return items;
  }

  deletePoll() {
    if (confirm(extractText(app.translator.trans('fof-polls.forum.moderation.delete_confirm')))) {
      this.attrs.poll.delete().then(() => {
        m.redraw.sync();
      });
    }
  }

  preventClose(e: Event) {
    if (this.state.hasSelectedOptions()) {
      e.preventDefault();
      return true;
    }
    return undefined;
  }
}
