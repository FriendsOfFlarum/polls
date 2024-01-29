import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollOption from './PollOption';
import User from 'flarum/common/models/User';

export default class PollVote extends Model {
  poll() {
    return Model.hasOne<Poll>('poll');
  }

  option() {
    return Model.hasOne<PollOption>('option');
  }

  user() {
    return Model.hasOne<User>('user');
  }

  pollId() {
    return Model.attribute<number>('pollId');
  }

  optionId() {
    return Model.attribute<number>('optionId');
  }

  apiEndpoint() {
    return `/fof/polls/${this.pollId()}/vote`;
  }
}
