import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Poll extends mixin(Model, {
    question: Model.attribute('question'),
    hasEnded: Model.attribute('hasEnded'),
    endDate: Model.attribute('endDate'),
    publicPoll: Model.attribute('publicPoll'),

    options: Model.hasMany('options'),
    votes: Model.hasMany('votes'),
}) {
    apiEndpoint() {
        return `/fof/polls${this.exists ? `/${this.data.id}` : ''}`;
    }
}
