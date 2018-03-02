import app from 'flarum/app';
import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';
import computed from 'flarum/utils/computed';

export default class Question extends mixin(Model, {
    question: Model.attribute('question'),
    answers: Model.hasMany('answers'),
    votes: Model.hasMany('votes')
}) {
    /**
     * @inheritDoc
     */
    apiEndpoint() {
        return '/treefiction/polls/questions';
    }
}
