import Modal from 'flarum/components/Modal';
import ItemList from 'flarum/utils/ItemList';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import listItems from 'flarum/helpers/listItems';

export default class ShowVotersModal extends Modal {
    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('reflar-polls.forum.votes_modal.title');
    }

    getUsers(answer) {
        let votes = []
        if (typeof this.props.votes === 'function') {
            votes = this.props.votes()
        } else {
            votes = this.props.votes
        }
        const items = new ItemList();
        var counter = 0;

        votes.map(vote => {
            var user = vote.user();

            if (parseInt(answer.id()) === parseInt(vote.data.attributes.option_id)) {
                counter++
                items.add(user.id(), (
                    <a href={app.route.user(user)} config={m.route}>
                        {avatar(user)} {' '}
                        {username(user)}
                    </a>
                ))
            }
        })
        
       if (counter === 0) {
           items.add('none', (
               <h4 style="color: #000">{app.translator.trans('reflar-polls.forum.modal.no_voters')}</h4>
           ))
       }

        return items;
    }

    content() {
        if (typeof this.props.answers === 'function') {
            this.answers = this.props.answers()
        } else {
            this.answers = this.props.answers
        }
        return (
            <div className="Modal-body">
                <ul className="VotesModal-list">
                    {this.answers.map(answer => (
                        <div>
                            <h2>{answer.answer() + ':'}</h2>
                            {listItems(this.getUsers(answer).toArray())}
                        </div>
                    ))}
                </ul>
            </div>
        )
    }
}
