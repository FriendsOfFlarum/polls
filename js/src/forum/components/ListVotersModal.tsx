import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollModel from '../models/Poll';
import PollVote from '../models/PollVote';
import User from 'flarum/common/models/User';
import PollOption from '../models/PollOption';

interface ListVotersModalAttrs extends IInternalModalAttrs {
  poll: PollModel;
  onsubmit: (data: object) => Promise<void>;
}

export default class ListVotersModal extends Modal<ListVotersModalAttrs> {
  oninit(vnode: Mithril.Vnode): void {
    super.oninit(vnode);

    this.loading = true;

    app.store
      .find('fof/polls', this.attrs.poll.id()!, {
        include: 'votes,votes.user,votes.option',
      })
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
    return <div className="Modal-body">{this.loading ? <LoadingIndicator /> : options.map(this.optionContent.bind(this))}</div>;
  }

  optionContent(opt: PollOption): Mithril.Children {
    const votes = (this.attrs.poll.votes() || []).filter((v) => opt.id() === v!.option()!.id()) as PollVote[];

    return (
      <div className="VotesModal-option">
        <h2>{opt.answer()! + ':'}</h2>

        {votes.length ? (
          <div className="VotesModal-list">{votes.map(this.voteContent.bind(this))}</div>
        ) : (
          <h4>{app.translator.trans('fof-polls.forum.modal.no_voters')}</h4>
        )}
      </div>
    );
  }

  voteContent(vote: PollVote): Mithril.Children {
    const user = vote.user() as User;
    const attrs = user && { href: app.route.user(user) };

    return (
      <Link {...attrs}>
        {avatar(user)} {username(user)}
      </Link>
    );
  }
}
