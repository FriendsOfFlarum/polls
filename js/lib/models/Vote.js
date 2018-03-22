import app from 'flarum/app';
import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';
import computed from 'flarum/utils/computed';

export default class Vote extends mixin(Model, {
    poll_id: Model.attribute('poll_id'),
    user_id: Model.attribute('user_id'),
    option_id: Model.attribute('option_id'),
}) {
    /**
     * @inheritDoc
     */
    apiEndpoint() {
        return '/reflar/polls/votes';
    }
}
