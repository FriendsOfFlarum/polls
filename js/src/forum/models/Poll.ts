import Model from 'flarum/common/Model';
import PollOption from './PollOption';
import PollVote from './PollVote';
import computed from 'flarum/common/utils/computed';
import PollGroup from './PollGroup';

export default class Poll extends Model {
  public tempOptions: PollOption[] | undefined;

  question() {
    return Model.attribute<string>('question').call(this);
  }

  subtitle() {
    return Model.attribute<string | null>('subtitle').call(this);
  }

  image() {
    return Model.attribute<string | null>('image').call(this);
  }

  imageUrl() {
    return Model.attribute<string | null>('imageUrl').call(this);
  }

  imageAlt() {
    return Model.attribute<string | null>('imageAlt').call(this);
  }

  isImageUpload() {
    return Model.attribute<boolean>('isImageUpload').call(this);
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
    const options = Model.hasMany<PollOption>('options').call(this);
    return options ? (options as PollOption[]) : [];
  }

  votes() {
    return Model.hasMany<PollVote>('votes').call(this);
  }

  myVotes(): PollVote[] {
    const myVotes = Model.hasMany<PollVote>('myVotes').call(this);
    return myVotes ? (myVotes as PollVote[]) : [];
  }

  pollGroup() {
    return Model.hasOne<PollGroup>('pollGroup').call(this);
  }

  isGlobal() {
    return Model.attribute<boolean>('isGlobal').call(this);
  }

  isHidden() {
    return computed<boolean, this>('hiddenAt', (hiddenAt) => !!hiddenAt).call(this);
  }

  // TODO: These two don't make sense as of now
  isUnread() {
    return false;
  }

  apiEndpoint() {
    /** @ts-ignore */
    return `/fof/polls${this.exists ? `/${this.data.id}` : ''}`;
  }
}
