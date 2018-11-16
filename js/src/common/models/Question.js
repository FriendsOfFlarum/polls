import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Question extends mixin(Model, {
    question: Model.attribute('question'),
    isEnded: Model.attribute('isEnded'),
    endDate: Model.attribute('endDate'),
    isPublic: Model.attribute('isPublic'),

    answers: Model.hasMany('answers'),
    votes: Model.hasMany('votes'),
}) {
    apiEndpoint() {
        return `/reflar/polls${this.exists ? `/${this.data.id}` : ''}`;
    }
}
