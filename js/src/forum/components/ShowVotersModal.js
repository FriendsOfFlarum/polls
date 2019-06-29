import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';

export default class ShowVotersModal extends Modal {
    init() {
        if (typeof this.props.votes === 'function') {
            this.props.votes = this.props.votes();
        }
    }

    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('reflar-polls.forum.votes_modal.title');
    }

    content() {
        if (typeof this.props.answers === 'function') {
            this.answers = this.props.answers();
        } else {
            this.answers = this.props.answers;
        }

        return (
            <div className="Modal-body">
                <ul className="VotesModal-list">
                    {this.answers.map(answer => {
                        const votes = this.props.votes.filter(v => parseInt(answer.id()) === parseInt(v.option_id())).map(v => v.user());

                        return (
                            <div>
                                <h2>{answer.answer() + ':'}</h2>

                                {votes.length ? (
                                    votes.map(u => {
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
                                    <h4 style="color: #000">{app.translator.trans('reflar-polls.forum.modal.no_voters')}</h4>
                                )}
                            </div>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
