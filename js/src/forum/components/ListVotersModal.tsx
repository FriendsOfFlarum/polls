import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Avatar from 'flarum/common/components/Avatar';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import username from 'flarum/common/helpers/username';
import User from 'flarum/common/models/User';
import PollModel from '../models/Poll';
import PollOption from '../models/PollOption';
import PollVote from '../models/PollVote';

export interface IListVotersModalAttrs extends IInternalModalAttrs {
  poll: PollModel;
}

export default class ListVotersModal<CustomAttrs extends IListVotersModalAttrs = IListVotersModalAttrs> extends Modal<CustomAttrs> {
  oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void {
    super.oninit(vnode);

    this.loading = true;

    app.store
      .find('polls', this.attrs.poll.id()!, { include: 'votes,votes.user,votes.option' })
      .then(() => (this.loading = false))
      .finally(() => m.redraw());
  }

  className(): string {
    return 'Modal--medium VotesModal';
  }

  title(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.votes_modal.title');
  }

  content(): Mithril.Children {
    const options = this.attrs.poll.options() as PollOption[];

    return <div className="Modal-body">{this.loading ? <LoadingIndicator /> : options.map((option) => this.optionContent(option))}</div>;
  }

  optionContent(option: PollOption): Mithril.Children {
    const votes = (this.attrs.poll.votes() || []).filter((vote) => vote!.option()!.id() === option.id()) as PollVote[];

    return (
      <div className="VotesModal-option" key={option.id()}>
        <h3>{option.answer()}</h3>
        {votes.length ? (
          <div className="VotesModal-list">{votes.map((vote) => this.voteContent(vote))}</div>
        ) : (
          <Placeholder text={app.translator.trans('fof-polls.forum.modal.no_voters')} />
        )}
      </div>
    );
  }

  voteContent(vote: PollVote): Mithril.Children {
    const user = vote.user() as User | null;

    // A vote outlives the account that cast it.
    if (!user) {
      return (
        <span className="VotesModal-voter" key={vote.id()}>
          <Avatar user={null} /> {username(user)}
        </span>
      );
    }

    return (
      <Link className="VotesModal-voter" href={app.route.user(user)} key={vote.id()}>
        <Avatar user={user} /> {username(user)}
      </Link>
    );
  }
}
