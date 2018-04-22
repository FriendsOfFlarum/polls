import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Question extends mixin(Model, {
    question: Model.attribute('question'),
    answers: Model.hasMany('answers'),
    votes: Model.hasMany('votes')
}) {
}
