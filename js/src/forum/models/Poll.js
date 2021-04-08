import Model from 'flarum/common/Model';

export default class Poll extends Model {
    question = Model.attribute('question');
    hasEnded = Model.attribute('hasEnded');
    endDate = Model.attribute('endDate');
    publicPoll = Model.attribute('publicPoll');
    voteCount = Model.attribute('voteCount');
    canSeeVotes = Model.attribute('canSeeVotes');
    canChangeVote = Model.attribute('canChangeVote');

    options = Model.hasMany('options');
    votes = Model.hasMany('votes');
    myVotes = Model.hasMany('myVotes');

    apiEndpoint() {
        return `/fof/polls${this.exists ? `/${this.data.id}` : ''}`;
    }
}
