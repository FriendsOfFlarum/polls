import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class PollVote extends mixin(Model, {
    poll: Model.hasOne('poll'),
    option: Model.hasOne('option'),
    user: Model.hasOne('user'),
}) {
    apiEndpoint() {
        return `/fof/polls/votes${this.exists ? `/${this.data.id}` : ''}`;
    }
}
