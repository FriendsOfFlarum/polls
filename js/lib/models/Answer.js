import app from 'flarum/app';
import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';
import computed from 'flarum/utils/computed';

export default class Answer extends mixin(Model, {
    answer: Model.attribute('answer'),
    votes: Model.attribute('votes'),
    percent: Model.attribute('percent')
}) {
    /**
     * @inheritDoc
     */
    apiEndpoint() {
        return '/reflar/polls/questions';
    }
}
