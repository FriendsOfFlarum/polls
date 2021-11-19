import Model from 'flarum/common/Model';

export default class PollOption extends Model {
  answer = Model.attribute('answer');
  voteCount = Model.attribute('voteCount');

  poll = Model.hasOne('polls');
  votes = Model.hasMany('votes');

  apiEndpoint() {
    return `/fof/polls/answers${this.exists ? `/${this.data.id}` : ''}`;
  }
}
