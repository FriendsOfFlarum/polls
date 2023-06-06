import Model from 'flarum/common/Model';

export default class Poll extends Model {
  question = Model.attribute('question');
  hasEnded = Model.attribute('hasEnded');
  endDate = Model.attribute('endDate');
  publicPoll = Model.attribute('publicPoll');
  allowMultipleVotes = Model.attribute('allowMultipleVotes');
  maxVotes = Model.attribute('maxVotes');

  voteCount = Model.attribute('voteCount');

  canEdit = Model.attribute('canEdit');
  canDelete = Model.attribute('canDelete');
  canSeeVotes = Model.attribute('canSeeVotes');
  canChangeVote = Model.attribute('canChangeVote');

  options = Model.hasMany('options');
  votes = Model.hasMany('votes');
  myVotes = Model.hasMany('myVotes');

  apiEndpoint() {
    return `/fof/polls${this.exists ? `/${this.data.id}` : ''}`;
  }
}
