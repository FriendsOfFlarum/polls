import app from 'flarum/app';
import {extend, override} from 'flarum/extend';

import DiscussionComposer from 'flarum/components/DiscussionComposer';

import Model from 'flarum/Model';
import Question from '../common/models/Question';
import Answer from '../common/models/Answer';
import Vote from '../common/models/Vote';
import Discussion from 'flarum/models/Discussion';
import User from 'flarum/models/User';

import addPollBadege from './addPollBadge'
import PollControl from './PollControl';
import PollDiscussion from './PollDiscussion';
import PollModal from './components/PollModal';

app.initializers.add('reflar-polls', app => {
    // Relationships
    app.store.models.answers = Answer;
    app.store.models.questions = Question;
    app.store.models.votes = Vote;

    Discussion.prototype.Poll = Model.hasOne('Poll');

    User.prototype.canEditPolls = Model.attribute('canEditPolls');
    User.prototype.canStartPolls = Model.attribute('canStartPolls');
    User.prototype.canSelfEditPolls = Model.attribute('canSelfEditPolls');
    User.prototype.canVote = Model.attribute('canVote');
	
    DiscussionComposer.prototype.addPoll = function(data) {
        app.modal.show(new PollModal(data));
    };

    // Add button to DiscussionComposer header
    extend(DiscussionComposer.prototype, 'headerItems', function (items) {
        if (app.session.user.canStartPolls()) {
            items.add('polls', (
                <a className="DiscussionComposer-poll" onclick={this.addPoll.bind(this, this.data())}>
                    {this.data().poll
                        ?
                        <span className="PollLabel">{app.translator.trans('reflar-polls.forum.composer_discussion.edit')}</span>
                        :
                        <span className="PollLabel">{app.translator.trans('reflar-polls.forum.composer_discussion.add_poll')}</span>}

                </a>), 1);
        }
    });

    extend(DiscussionComposer.prototype, 'onsubmit', function() {
        extend(DiscussionComposer.prototype, 'data', function (data) {
            data.poll = undefined;
        });
    })

    addPollBadege();
    PollDiscussion();
    PollControl();
});
