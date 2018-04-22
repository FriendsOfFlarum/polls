import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Answer extends mixin(Model, {
    answer: Model.attribute('answer'),
    votes: Model.attribute('votes'),
    percent: Model.attribute('percent')
}) {
}
