import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollOption from './PollOption';
import User from 'flarum/common/models/User';

export default class PollVote extends Model {
  poll() {
    return Model.hasOne<Poll>('poll').call(this);
  }

  option() {
    const result = Model.hasOne<PollOption>('option').call(this);
    return result === false ? null : result;
  }

  user() {
    return Model.hasOne<User>('user').call(this);
  }

  pollId() {
    return Model.attribute<number>('pollId').call(this);
  }

  optionId() {
    return Model.attribute<number>('optionId').call(this);
  }

  apiEndpoint() {
    return `/fof/polls/${this.pollId()}/vote`;
  }
}
