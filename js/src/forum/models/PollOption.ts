import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollVote from './PollVote';

export default class PollOption extends Model {
  answer() {
    return Model.attribute<string>('answer').call(this);
  }

  imageUrl() {
    return Model.attribute<string>('imageUrl').call(this);
  }

  vouteCount() {
    return Model.attribute<number>('voteCount').call(this);
  }

  poll() {
    return Model.hasOne<Poll>('polls').call(this);
  }

  votes() {
    return Model.hasMany<PollVote>('votes').call(this);
  }

  apiEndpoint() {
    return `/fof/polls/answers${this.exists ? `/${this.data.id}` : ''}`;
  }
}
