import Model from 'flarum/common/Model';

export default class Poll extends Model {
  question = Model.attribute('question');
  hasEnded = Model.attribute('hasEnded');
  endDate = Model.attribute('endDate');

  publicPoll = Model.attribute('publicPoll');
  hideVotes = Model.attribute('hideVotes');
  allowMultipleVotes = Model.attribute('allowMultipleVotes');
  maxVotes = Model.attribute('maxVotes');

  voteCount = Model.attribute('voteCount');

  canVote = Model.attribute('canVote');
  canEdit = Model.attribute('canEdit');
  canDelete = Model.attribute('canDelete');
  canSeeVoters = Model.attribute('canSeeVoters');
  canChangeVote = Model.attribute('canChangeVote');

  options = Model.hasMany('options');
  votes = Model.hasMany('votes');
  myVotes = Model.hasMany('myVotes');

  apiEndpoint() {
    return `/fof/polls${this.exists ? `/${this.data.id}` : ''}`;
  }
}
