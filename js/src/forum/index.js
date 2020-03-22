import { extend } from 'flarum/extend';
import Model from 'flarum/Model';
import CommentPost from 'flarum/components/CommentPost';

import Poll from './models/Poll';
import PollOption from './models/PollOption';
import PollVote from './models/PollVote';

import addDiscussionBadge from './addDiscussionBadge';
import addDiscussionComposerItem from './addDiscussionComposerItem';
import addPollToDiscussion from './addPollToDiscussion';
import addDiscussionControls from './addDiscussionControls';

app.initializers.add('fof/polls', () => {
    app.store.models.polls = Poll;
    app.store.models.poll_options = PollOption;
    app.store.models.poll_votes = PollVote;

    app.store.models.discussions.prototype.poll = Model.hasOne('poll');

    app.store.models.users.prototype.canEditPolls = Model.attribute('canEditPolls');
    app.store.models.users.prototype.canStartPolls = Model.attribute('canStartPolls');
    app.store.models.users.prototype.canSelfEditPolls = Model.attribute('canSelfEditPolls');
    app.store.models.users.prototype.canVotePolls = Model.attribute('canVotePolls');

    addDiscussionBadge();
    addDiscussionControls();
    addDiscussionComposerItem();
    addPollToDiscussion();
});
