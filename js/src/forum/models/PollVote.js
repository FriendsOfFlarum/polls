import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class PollVote extends mixin(Model, {
    poll: Model.hasOne('poll'),
    option: Model.hasOne('option'),
    user: Model.hasOne('user'),

    pollId: Model.attribute('pollId'),
    optionId: Model.attribute('optionId'),
}) {
    apiEndpoint() {
        return `/fof/polls/${this.pollId()}/vote`;
    }
}
