import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollVote from './PollVote';

export default class PollOption extends Model {
  answer() {
    return Model.attribute<string>('answer').call(this);
  }

  image() {
    return Model.attribute<string | null>('image').call(this);
  }

  imageUrl() {
    return Model.attribute<string>('imageUrl').call(this);
  }

  imageAlt() {
    return Model.attribute<string | null>('imageAlt').call(this);
  }

  voteCount() {
    return Model.attribute<number>('voteCount').call(this);
  }

  poll() {
    return Model.hasOne<Poll>('polls').call(this);
  }

  votes() {
    return Model.hasMany<PollVote>('votes').call(this);
  }

  apiEndpoint() {
    /** @ts-ignore */
    return `/fof/polls/answers${this.exists ? `/${this.data.id}` : ''}`;
  }
}
