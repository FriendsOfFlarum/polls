import app from 'flarum/forum/app';

import Modal from 'flarum/common/components/Modal';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';

export default class ListVotersModal extends Modal {
  className() {
    return 'Modal--small VotesModal';
  }

  title() {
    return app.translator.trans('fof-polls.forum.votes_modal.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <ul className="VotesModal-list">
          {this.attrs.poll.options().map(this.optionContent.bind(this))}
        </ul>
      </div>
    );
  }

  optionContent(opt) {
    const votes = (this.attrs.poll.votes() || []).filter((v) => opt.id() === v.option().id());

    return (
      <div>
        <h2>{opt.answer() + ':'}</h2>

        {votes.length ? (
          votes.map(this.voteContent.bind(this))
        ) : (
          <h4 style="color: #000">{app.translator.trans('fof-polls.forum.modal.no_voters')}</h4>
        )}
      </div>
    );
  }

  voteContent(vote) {
    const user = vote.user();
    const attrs = user && { href: app.route.user(user) };

    return (
      <li>
        <Link {...attrs}>
          {avatar(user)} {username(user)}
        </Link>
      </li>
    );
  }
}
