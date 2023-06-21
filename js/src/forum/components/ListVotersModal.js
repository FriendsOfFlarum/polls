import app from 'flarum/forum/app';

import Modal from 'flarum/common/components/Modal';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';
import Stream from 'flarum/common/utils/Stream';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export default class ListVotersModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = Stream(true);

    app.store
      .find('discussions', this.attrs.discussion.id(), {
        include: 'poll.votes,poll.votes.user,poll.votes.option',
      })
      .then(() => this.loading(false))
      .finally(() => m.redraw());
  }

  className() {
    return 'Modal--medium VotesModal';
  }

  title() {
    return app.translator.trans('fof-polls.forum.votes_modal.title');
  }

  content() {
    return <div className="Modal-body">{this.loading() ? <LoadingIndicator /> : this.attrs.poll.options().map(this.optionContent.bind(this))}</div>;
  }

  optionContent(opt) {
    const votes = (this.attrs.poll.votes() || []).filter((v) => opt.id() === v.option().id());

    return (
      <div className="VotesModal-option">
        <h2>{opt.answer() + ':'}</h2>

        {votes.length ? (
          <div className="VotesModal-list">{votes.map(this.voteContent.bind(this))}</div>
        ) : (
          <h4>{app.translator.trans('fof-polls.forum.modal.no_voters')}</h4>
        )}
      </div>
    );
  }

  voteContent(vote) {
    const user = vote.user();
    const attrs = user && { href: app.route.user(user) };

    return (
      <Link {...attrs}>
        {avatar(user)} {username(user)}
      </Link>
    );
  }
}
