import { extend } from 'flarum/extend';
import DiscussionComposer from 'flarum/components/DiscussionComposer';

import CreatePollModal from './components/CreatePollModal';

export default () => {
    DiscussionComposer.prototype.addPoll = function() {
        app.modal.show(
            new CreatePollModal({
                poll: this.poll,
                onsubmit: poll => (this.poll = poll),
            })
        );
    };

    // Add button to DiscussionComposer header
    extend(DiscussionComposer.prototype, 'headerItems', function(items) {
        if (app.session.user && app.session.user.canStartPolls()) {
            items.add(
                'polls',
                <a className="DiscussionComposer-poll" onclick={this.addPoll.bind(this)}>
                    <span className={`PollLabel ${this.poll ? '' : 'none'}`}>
                        {app.translator.trans(`fof-polls.forum.composer_discussion.${this.poll ? 'edit' : 'add'}_poll`)}
                    </span>
                </a>,
                1
            );
        }
    });

    extend(DiscussionComposer.prototype, 'data', function(data) {
        if (this.poll) {
            data.poll = this.poll;
        }
    });
};
