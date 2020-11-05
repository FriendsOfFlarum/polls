import { extend } from 'flarum/extend';
import Badge from 'flarum/components/Badge';
import DiscussionList from 'flarum/components/DiscussionList';
import Discussion from 'flarum/models/Discussion';

export default () => {
    extend(DiscussionList.prototype, 'requestParams', params => {
        params.include.push('poll');
    });

    extend(Discussion.prototype, 'badges', function(badges) {
        if (this.poll()) {
            badges.add(
                'poll',
                Badge.component({
                    type: 'poll',
                    icon: 'fa fa-signal',
                }, app.translator.trans('fof-polls.forum.tooltip.badge')),
                5
            );
        }
    });
};
