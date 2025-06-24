import Model from 'flarum/common/Model';
import Poll from './Poll';

export default class PollGroup extends Model {
  name() {
    return Model.attribute<string>('name').call(this);
  }

  createdAt() {
    return Model.attribute('createdAt', Model.transformDate).call(this);
  }

  polls() {
    return Model.hasMany<Poll>('polls').call(this) || null;
  }

  canEdit() {
    return Model.attribute<boolean>('canEdit').call(this);
  }

  canDelete() {
    return Model.attribute<boolean>('canDelete').call(this);
  }

  apiEndpoint() {
    //@ts-ignore
    return `/fof/polls/groups${this.exists ? `/${this.id()}` : ''}`;
  }
}
