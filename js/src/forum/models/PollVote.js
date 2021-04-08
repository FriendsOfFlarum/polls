import Model from 'flarum/common/Model';

export default class PollVote extends Model {
    poll = Model.hasOne('poll');
    option = Model.hasOne('option');
    user = Model.hasOne('user');

    pollId = Model.attribute('pollId');
    optionId = Model.attribute('optionId');

    apiEndpoint() {
        return `/fof/polls/${this.pollId()}/vote`;
    }
}
