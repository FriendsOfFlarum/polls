import Model from 'flarum/common/Model';
import PollOption from './PollOption';
import PollVote from './PollVote';

export default class Poll extends Model {
  question() {
    return Model.attribute<string>('question').call(this);
  }

  hasEnded() {
    return Model.attribute<boolean>('hasEnded').call(this);
  }

  endDate() {
    return Model.attribute('endDate', Model.transformDate).call(this);
  }

  publicPoll() {
    return Model.attribute<boolean>('publicPoll').call(this);
  }

  hideVotes() {
    return Model.attribute<boolean>('hideVotes').call(this);
  }

  allowChangeVote() {
    return Model.attribute<boolean>('allowChangeVote').call(this);
  }

  allowMultipleVotes() {
    return Model.attribute<boolean>('allowMultipleVotes').call(this);
  }

  maxVotes() {
    return Model.attribute<number>('maxVotes').call(this);
  }

  voteCount() {
    return Model.attribute<number>('voteCount').call(this);
  }

  canVote() {
    return Model.attribute<boolean>('canVote').call(this);
  }

  canEdit() {
    return Model.attribute<boolean>('canEdit').call(this);
  }

  canDelete() {
    return Model.attribute<boolean>('canDelete').call(this);
  }

  canSeeVoters() {
    return Model.attribute<boolean>('canSeeVoters').call(this);
  }

  canChangeVote() {
    return Model.attribute<boolean>('canChangeVote').call(this);
  }

  options() {
    return Model.hasMany<PollOption>('options');
  }

  votes() {
    return Model.hasMany<PollVote>('votes');
  }

  myVotes() {
    return Model.hasMany<PollVote>('myVotes');
  }

  apiEndpoint() {
    return `/fof/polls${this.exists ? `/${this.data.id}` : ''}`;
  }
}
