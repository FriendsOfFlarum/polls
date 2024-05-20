import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollVote from './PollVote';

export default class PollOption extends Model {
  answer() {
    return Model.attribute<string>('answer').call(this);
  }

  imageUrl() {
    return Model.attribute<string | null>('imageUrl').call(this);
  }

  isImageUpload() {
    return Model.attribute<boolean>('isImageUpload').call(this);
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
