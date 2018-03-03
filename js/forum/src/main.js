import app from 'flarum/app';
import { extend, override } from 'flarum/extend';

import DiscussionComposer from 'flarum/components/DiscussionComposer';

import Model from 'flarum/Model';
import Question from 'treefiction/polls/models/Question';
import Answer from 'treefiction/polls/models/Answer';
import Vote from 'treefiction/polls/models/Vote';
import Discussion from 'flarum/models/Discussion';

import PollControl from 'treefiction/polls/PollControl';
import PollDiscussion from 'treefiction/polls/PollDiscussion';
import PollModal from 'treefiction/polls/components/PollModal';

app.initializers.add('treefiction-polls', app => {
  // Relationships
  app.store.models['treefiction-polls-answer'] = Answer;
  app.store.models['treefiction-polls-question'] = Question;
  app.store.models['treefiction-polls-vote'] = Vote;

  Discussion.prototype.treefictionPolls = Model.hasOne('treefictionPolls');

  const pollModal = new PollModal();

  DiscussionComposer.prototype.addPoll = function() {
    app.modal.show(pollModal);
  };

  // Add button to DiscussionComposer header
  extend(DiscussionComposer.prototype, 'headerItems', function(items) {
    items.add('polls', (<a className="DiscussionComposer-changeTags" onclick={this.addPoll}><span className="TagLabel">Add poll</span></a>), 1);
  });

  const PollDiscussionClass = new PollDiscussion();
  PollDiscussionClass.PollView();

  PollControl();
});
