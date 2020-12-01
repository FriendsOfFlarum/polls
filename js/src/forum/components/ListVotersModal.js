import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';

export default class ListVotersModal extends Modal {
    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('fof-polls.forum.votes_modal.title');
    }

    content() {
        return (
            <div className="Modal-body">
                <ul className="VotesModal-list">
                    {this.attrs.poll.options().map((opt) => {
                        const votes = this.attrs.poll
                            .votes()
                            .filter((v) => opt.id() === v.option().id())
                            .map((v) => v.user());

                        return (
                            <div>
                                <h2>{opt.answer() + ':'}</h2>

                                {votes.length ? (
                                    votes.map((u) => {
                                        const attrs = u && { href: app.route.user(u), config: m.route };

                                        return (
                                            <li>
                                                <a {...attrs}>
                                                    {avatar(u)} {username(u)}
                                                </a>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <h4 style="color: #000">{app.translator.trans('fof-polls.forum.modal.no_voters')}</h4>
                                )}
                            </div>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
