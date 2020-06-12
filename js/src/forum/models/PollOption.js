import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class PollOption extends mixin(Model, {
    answer: Model.attribute('answer'),

    poll: Model.hasOne('polls'),
    votes: Model.hasMany('votes'),
}) {
    apiEndpoint() {
        return `/fof/polls/answers${this.exists ? `/${this.data.id}` : ''}`;
    }
}
