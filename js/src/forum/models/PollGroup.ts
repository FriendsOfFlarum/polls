import Model from 'flarum/common/Model';
import Poll from './Poll';
import User from 'flarum/common/models/User';

export default class PollGroup extends Model {
  name() {
    return Model.attribute<string>('name').call(this);
  }

  createdAt() {
    return Model.attribute('createdAt', Model.transformDate).call(this);
  }

  user() {
    return Model.hasOne<User>('user').call(this);
  }

  polls() {
    return Model.hasMany<Poll>('polls').call(this);
  }

  apiEndpoint() {
    //@ts-ignore
    return `/fof/polls/groups${this.exists ? `/${this.id()}` : ''}`;
  }
}
