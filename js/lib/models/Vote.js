import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Vote extends mixin(Model, {
    poll_id: Model.attribute('poll_id'),
    user_id: Model.attribute('user_id'),
    option_id: Model.attribute('option_id'),
}) {
}
